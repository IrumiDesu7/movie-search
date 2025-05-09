import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";

export function MovieCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative aspect-[2/3]">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="p-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/3" />
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-full" />
      </CardContent>
      <CardFooter className="flex justify-between p-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </CardFooter>
    </Card>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <>
      <DialogHeader className="mb-4">
        <Skeleton className="h-9 w-3/4" />
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-[2/3] rounded-lg" />
          <Card>
            <CardHeader className="p-4 pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="grid gap-2 p-4 pt-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader className="p-4 pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 pt-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
