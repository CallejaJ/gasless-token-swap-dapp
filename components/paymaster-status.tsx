"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle } from "lucide-react";

export function PaymasterStatus() {
  return (
    <Card className='w-full mb-6'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Zap className='h-5 w-5' />
          Paymaster Status
        </CardTitle>
        <CardDescription>Sponsored gas for all transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Status</span>
            <Badge variant='default' className='bg-green-600'>
              <CheckCircle className='h-3 w-3 mr-1' />
              Active
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Sponsor</span>
            <span className='text-sm'>Abstract Protocol</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Gas Coverage</span>
            <span className='text-sm font-bold text-green-600'>100%</span>
          </div>
          <div className='text-xs text-muted-foreground mt-4'>
            All transaction fees are automatically covered. You don't need any
            ETH in your wallet.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
