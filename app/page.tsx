'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProducts } from "@/app/actions/product"
import { getOrders } from "@/app/actions/order"
import { getInventoryTransactions } from "@/app/actions/inventory-transaction"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Order {
  id: number
  customerName: string
  orderDate: Date
  orderItems: Array<{
    quantity: number
    price: number
    product: {
      name: string
    }
  }>
}

interface Transaction {
  quantity: number
  createdAt: Date
  product: {
    name: string
  }
}

function formatThaiDate(date: Date) {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<{
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    totalInventory: number
    recentOrders: Order[]
    inventoryMovement: Transaction[]
  }>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalInventory: 0,
    recentOrders: [],
    inventoryMovement: []
  })

  useEffect(() => {
    const fetchData = async () => {
      const [products, orders, transactions] = await Promise.all([
        getProducts(),
        getOrders(),
        getInventoryTransactions()
      ])

      const totalRevenue = orders.reduce((sum, order) => 
        sum + order.orderItems.reduce((itemSum, item) => 
          itemSum + (item.quantity * item.price), 0), 0
      )

      const totalInventory = transactions.reduce((sum, transaction) => 
        sum + transaction.quantity, 0
      )

      setMetrics({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        totalInventory,
        recentOrders: orders.slice(-5),
        inventoryMovement: transactions.slice(-10)
      })
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.totalProducts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${metrics.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.totalInventory}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentOrders.map((order: Order) => (
                <div key={order.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {formatThaiDate(order.orderDate)}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${order.orderItems.reduce((sum, item) => 
                      sum + (item.quantity * item.price), 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Movement</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.inventoryMovement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="createdAt" 
                  tickFormatter={(value) => formatThaiDate(value)} 
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 