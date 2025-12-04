import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaExclamationTriangle } from 'react-icons/fa'; 
import { useLocation } from "react-router";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function DialogDemo({
}) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const LocNames = pathnames.at(-1)
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FaExclamationTriangle />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
           {renderGuide(LocNames)}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

const FlowcaseGuide = () => {
    return (
        <>
         <h1>THIS IS FLOW CASE</h1>
            <Carousel className="w-full max-w-xs">
                <CarouselContent>
                    {Array.from({ length: 9 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </>
    )
}

const renderGuide = (LocNames) => {
  switch (LocNames) {
    case "searchcaseproto2":
      return <CreateCaseGuide />;
    case "viewcase":
      return <ViewCaseGuide />;
    default:
      return <FlowcaseGuide />;
  }
};

const CreateCaseGuide = () => {
    return (
        <>
        <h1>THIS is Create Case</h1>
        </>
    )
}

const ViewCaseGuide = () => {
  return (
    <>
      <h1>THIS IS VIEW CASE</h1>

    </>
  )
}
