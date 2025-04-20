import React from "react";
import { Skeleton } from "@/components/ui/skeleton";


export const SkeletonModel1= ()=> {
  return (
    <div className="space-x-0.5">
      <Skeleton className="h-[36rem] w-[4.5rem]" />
    </div>
  );
}

export const SkeletonModel2 = ()=>{
  return (
    <div className="space-y-1 space-x-1">
      <Skeleton className="h-[4.2rem] w-[74.5rem]" />
    </div>
  )
}

export const SkeletonModel3 = ()=>{
  return (
    <div className="space-y-2 space-x-1">
      <Skeleton className="h-[4.3rem] w-[54rem]" />
      <Skeleton className="h-9 w-[12rem]" />
      <Skeleton className="h-10 w-[54rem]" />
      <Skeleton className="h-10 w-[54rem]" />
      <Skeleton className="h-10 w-[54rem]" />
      <div className="pt-4 space-y-2">
        <Skeleton className="ml-[22rem] h-10 w-[12rem]" />
        <Skeleton className="h-[3.2rem] w-[54rem]" />
        <Skeleton className="ml-[23rem] h-10 w-[10rem]" />
        <Skeleton className="h-[3.2rem] w-[54rem]" />
      </div>
    </div>
  )
}

export const SkeletonModel4 = ()=>{
  return (
    <div className="space-y-2 space-x-1">
      <Skeleton className="ml-[4px] h-[16rem] w-[20rem]" />
      <Skeleton className="h-[15rem] w-[19.8rem]" />
    </div>
  )
}

