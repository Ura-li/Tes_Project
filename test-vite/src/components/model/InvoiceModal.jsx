import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "../ui/card";
import CaseField from "../CaseField";
import { Textarea } from "../ui/textarea";
import { debounce } from "lodash";
import { SearchCommandBlock } from "../sc-select";
import ApiCustomer from "@/api";
import { toast } from "sonner";


export default InvoiceDialog;