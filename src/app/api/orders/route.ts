import { NextRequest, NextResponse } from "next/server";
export const runtime = 'nodejs';
import { connectToDatabase } from "@/app/lib/mongodb";
import Dish from "@/models/Dish";
// import QRCode from 'qrcode';
import Order from "@/models/Order";
import Counter from '@/models/Counter';

interface OrderItem {
  dishId: string;
  quantity: number;
  specialInstructions?: string;
}

interface OrderQuery {
  restaurantId?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { items, tableNumber, customerName, restaurantId } = body;

    // Calculate total and estimated wait time
    let totalAmount = 0;
    let maxPreparationTime = 0;

    const itemDetails = await Promise.all(
      items.map(async (item: OrderItem) => {
        const dish = await Dish.findById(item.dishId);
        if (!dish) throw new Error(`Dish ${item.dishId} not found`);

        totalAmount += dish.price * item.quantity;
        maxPreparationTime = Math.max(maxPreparationTime, dish.preparationTime);

        return {
          dish: dish._id,
          quantity: item.quantity,
          price: dish.price,
          specialInstructions: item.specialInstructions,
        };
      }),
    );

    // Generate sequential order ID (atomic) using Counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: 'orderId' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    const seq = (counter && counter.seq) || 1;
    const orderId = `ORD-${String(seq).padStart(3, '0')}`;
    const invoiceNumber = `INV-${String(seq).padStart(3, '0')}`;

    // Generate QR code for payment
    // const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/${orderId}`;
    // const qrCodeData = await QRCode.toDataURL(paymentUrl);

    // Calculate tax and final amount (simplified)
    // const taxRate = 0.1; // 10% tax
    // const serviceCharge = 0.05; // 5% service charge
    // const taxAmount = totalAmount * taxRate;
    // const serviceAmount = totalAmount * serviceCharge;
    // const finalAmount = totalAmount + taxAmount + serviceAmount;
    const finalAmount = totalAmount;

    const order = new Order({
      orderId,
      tableNumber,
      customerName: customerName || "Guest",
      items: itemDetails,
      totalAmount,
      // taxAmount,
      // serviceCharge: serviceAmount,
      finalAmount,
      estimatedWaitTime: maxPreparationTime,
      restaurantId: restaurantId || "65d4a1b2e3f4a7c8d9e0f123", // Default restaurant ID
      // qrCodeData,
      invoiceNumber,
    });

    await order.save();

    // Emit WebSocket event
    // In production, you'd emit via Socket.io server

    return NextResponse.json({
      success: true,
      order,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error && error.stack ? error.stack : undefined;
    return NextResponse.json(
      { error: "Failed to create order", message, stack },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");
    const status = searchParams.get("status");
    const customerName = searchParams.get("customerName");

    const query: OrderQuery = {};

    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    if (status) {
      query.status = status;
    }

    if (customerName) {
      query.customerName = customerName;
    }

    const orders = await Order.find(query)
      .populate("items.dish")
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
