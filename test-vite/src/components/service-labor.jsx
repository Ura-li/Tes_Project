import React from 'react'
import { 
    Card, 
    CardContent, 
    CardTitle,
    CardHeader,
    CardFooter
} from './ui/card'
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger
} from './ui/tabs'
import { CaseField } from './quick-wo-input'
import { Input } from './ui/input'
import { KeyRound } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from './ui/select'

export const ServiceLabor = () => {
  return (
    <Card className={"bg-gray-100 h-[100dvh]"}>
      <CardContent className={"p-0 bg-gray-100"}>
        <Tabs defaultValue="General" className="w-full">
          <Card className={"flex flex-col gap-4 p-5"}>
            <CardTitle className={"text-xl "}>NEW Labor Types</CardTitle>
            <TabsList className={"bg-white"}>
              <TabsTrigger
                variant={"underline"}
                className={"cursor-pointer"}
                value="General"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                variant={"underline"}
                className={"cursor-pointer"}
                value="Estimate_information"
              >
                Estimate information
              </TabsTrigger>
              <TabsTrigger
                variant={"underline"}
                className={"cursor-pointer"}
                value="Duration_Safe_Amount"
              >
                Duration & Safe Amount
              </TabsTrigger>
              <TabsTrigger
                variant={"underline"}
                className={"cursor-pointer"}
                value="Offer"
              >
                Offer
              </TabsTrigger>
              <TabsTrigger
                variant={"underline"}
                className={"cursor-pointer"}
                value="Notes"
              >
                Notes
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="General" className={"p-2 flex flex-col gap-2"}>
            <Card className={"flex flex-col gap-4 p-5"}>
              <CardHeader>
                <CardTitle className=" text-lg">General</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className={"grid gap-5 grid-cols-6 items-center"}>
                <CaseField label={"Service"} span={2}>
                  <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    placeholder="Look For Service"
                  />
                </CaseField>
                <CaseField label={"Line Status"} span={2}>
                  <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    value={"Used"}
                  />
                </CaseField>
                <CaseField label={"Line Status"} span={2} icon={KeyRound}>
                  <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    value={"---"}
                  />
                </CaseField>
              </CardContent>
            </Card>
            <Card className={"flex flex-col gap-4 p-5"}>
              <CardHeader>
                <CardTitle className=" text-lg">Description</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className={"grid gap-5 grid-cols-4 items-center"}>
                <CaseField label={"Service"} span={3}>
                  <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    value={"---"}
                  />
                </CaseField>
                <CaseField label={"Line Status"} span={3}>
                  <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    value={"---"}
                  />
                </CaseField>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="Duration_Safe_Amount">
            <Card>
              <CardHeader>
                <CardTitle className=" text-lg">General</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className={'grid grid-cols-6 items-center gap-5'}>
                <CaseField label={'Duration'} icon={KeyRound} span={2}>
                    <Select>
                        <SelectTrigger className={'w-full'}>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='1_minute'>1 minute</SelectItem>
                            <SelectItem value='15_minute'>15 minute</SelectItem>
                            <SelectItem value='30_minute'>30 minute</SelectItem>
                            <SelectItem value='45_minute'>45 minute</SelectItem>
                            <SelectItem value='1_hour'>1 hour</SelectItem>
                        </SelectContent>
                    </Select>
                </CaseField>
                <CaseField label={'Total Amount'} icon span={2}>
                <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    value={"0.00"}
                  />
                </CaseField>
                <CaseField label={'Duration To Bill'} icon={KeyRound} span={2}>
                <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    value={"---"}
                  />
                </CaseField>
                <CaseField label={'Billable'} span={2}> 
                    <Select>
                        <SelectTrigger className={'w-full'}>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='yes'>Yes</SelectItem>
                            <SelectItem value='no'>No</SelectItem>
                        </SelectContent>
                    </Select>
                </CaseField>
                <CaseField label={'Unit Amount'} icon={KeyRound} span={2}>
                <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    value={"---"}
                  />
                </CaseField>
                <CaseField label={'MO Transction Currency'} icon span={2}>
                <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    value={"---"}
                  />
                </CaseField>
                <CaseField label={'Subtotal'} icon span={2}>
                <Input
                    variant={"invisible"}
                    type="text"
                    className="col-span-4"
                    value={"0.00"}
                  />
                </CaseField>
                <CaseField label={'Outside Of Bussiness Hours'} span={2} className={'col-start-1'}> 
                    <Select>
                        <SelectTrigger className={'w-full'}>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='yes'>Yes</SelectItem>
                            <SelectItem value='no'>No</SelectItem>
                        </SelectContent>
                    </Select>
                </CaseField>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
