"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product } from "./types"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "categoryId",
    header: "Category",
  },
  {
    accessorKey: "supplierId",
    header: "Supplier",
  },
]