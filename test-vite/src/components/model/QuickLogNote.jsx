import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ui/dialog'
import CaseField from '../CaseField'
import { SearchCommandBlock, SelectYN } from '../sc-select'
import { Input } from '../ui/input'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
 } from '../ui/table'
 import { format } from 'date-fns'
 import { parseNoteText } from "@/lib/utils.jsx";


export const QuickLogNote = ({
  formData,
  notesList,
  onChange,
  open
}) => {
  return (
    <>
    <Dialog open={open}>
        <DialogHeader>

        </DialogHeader>
        <DialogContent>
          <div className="flex flex-col gap-2">
                              
          
                          <div className="grid grid-cols-2 gap-4">
                            <CaseField
                              label="Log Type"
          
                            >
                              {/* <Select
                                value={formData?.LogType}
                                onValueChange={(val) => onChange("LogType", val)}
                              >
                                <SelectTrigger
                                  className={"w-[100%] hover:shadow-lg border-b-0 p-3"}
                                >
                                  <SelectValue placeholder="Log Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="NotesLog">Notes Log</SelectItem>
                                  <SelectItem value="PhoneLog">Phone Log</SelectItem>
                                </SelectContent>
                              </Select> */}
          
                              <SearchCommandBlock
                               value={formData?.LogType}
                               onChange={(val) => onChange("LogType", val)}
                               options={[
                                "Notes Log",
                                "Phone Log"
                               ]}
                                placeholder="--Select--"
                              />
                            </CaseField>
          
                            <CaseField
                              label="Action Type"
          
                            >
                              <SearchCommandBlock
                                value={formData?.ActionType}
                                onChange={(val) => onChange("ActionType", val)}
                                placeholder="--Select--"
                                options={[
                                  "Inbound Customer call",
                                  "Action Plan",
                                  "Administrative task",
                                  "CE/Partner Assist",
                                  "Customer Email",
                                ]}
                                
                              />
                            </CaseField>
          
                            <CaseField
                              label="Template"
                              lock
                            >
                              <Input variant="invisible" placeholder="---" />
                            </CaseField>
          
                            <CaseField
                              label="Visible Externally"
          
                            >
                              <SelectYN
                                value={
                                  formData?.VisibleExternally === undefined ||
                                    formData?.VisibleExternally === null
                                    ? ""
                                    : formData?.VisibleExternally
                                      ? "Yes"
                                      : "No"
                                }
                                onValueChange={(val) =>
                                  onChange("VisibleExternally", val === "Yes")
                                }
                              ></SelectYN>
                            </CaseField>
          
                            <CaseField
                              label="Number of Minutes Spent"
                                lock
                            >
                              <Input variant="invisible" placeholder="---" />
                            </CaseField>
          
                            <CaseField
                              label="Notes"
          
          
                              star
                            >
                              <textarea
                                className="w-full h-full min-h-[100px] resize-none border rounded-md p-3 text-sm ring-1 ring-gray-300 shadow-sm"
                                value={formData?.Note || ""}
                                onChange={(e) => onChange("Note", e.target.value)}
                                placeholder="Write your note"
                              />
                            </CaseField>
                          </div>
                          <div className="w-full overflow-auto rounded-2xl shadow-xl">
                            <Table >
                              <TableHeader className={'bg-slate-300 '}>
                                <TableRow>
                                  <TableHead>Created On</TableHead>
                                  <TableHead>Created By</TableHead>
                                  <TableHead>Log Type</TableHead>
                                  <TableHead>Action Type</TableHead>
                                  {/* <TableHead>Template</TableHead>
                                  <TableHead>Visible Externally</TableHead>
                                  <TableHead>Number of Minutes Spent</TableHead> */}
                                  <TableHead>Role</TableHead>
                                  <TableHead>Note</TableHead>
                                  <TableHead></TableHead>
                                  <TableHead></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Array.isArray(notesList) && notesList.length > 0 ? (
                                  notesList.map((n,i) => (
                                    
                                    <TableRow key={n.NoteID} className={``}>
                                      <TableCell>{n.CreatedOn ? format(new Date(n.CreatedOn), 'yyyy-MM-dd HH:mm') : '-'}</TableCell>
                                      <TableCell>{n.createdByUser?.Name || n.CreatedBy || '-'}</TableCell>
                                      <TableCell>{n.LogType || '-'}</TableCell>
                                      <TableCell>{n.ActionType || '-'}</TableCell>
                                      {/* <TableCell>{n.Template || '-'}</TableCell>
                                      <TableCell>{n.VisibleExternally || '-'}</TableCell>
                                      <TableCell>{n.MinutesSpent || '-'}</TableCell> */}
                                      <TableCell>{n.createdByUser?.Role || '-'}</TableCell>
                                      <TableCell  colSpan="3" className="whitespace-pre-wrap max-w-xl">{parseNoteText(n.Note)}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center text-sm text-gray-500">No notes yet</TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                            </div>
        </DialogContent>
        <DialogFooter>
            
        </DialogFooter>
    </Dialog>
    </>
  )
}
