import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const offsetDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)); // handle timezone
  return offsetDate.toISOString().split('T')[0]; // ambil 'YYYY-MM-DD'
};

export function DatePickertoDateOrNull(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);
  return isNaN(date) ? null : date;
}

/**
 * Format a date string to 'YYYY-MM-DD HH:MM:SS' for MySQL DATETIME
 * Handles timezone correctly
 */
export function formatDateForMySQL(dateString){
  const date = new Date(dateString);

  return date.toISOString()
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAccountingRupiah(value) {
  if (value == null || value === "") return "---";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function unformatRupiah(str) {
  if (!str) return "";
  return Number(str.replace(/[^0-9]/g, ""));
}

function isBusinessDayJakarta(dateInput) {
  const d = new Date(dateInput);

  // 1..7 where 1=Mon ... 7=Sun (ISO-ish) in the chosen timezone
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
  }).format(d);

  // "Mon", "Tue", "Wed", "Thu", "Fri"
  return weekday !== "Sat" && weekday !== "Sun";
}


function toJakartaYYYYMMDD(dateInput) {
  const d = new Date(dateInput);

  // format as YYYY-MM-DD in Asia/Jakarta
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = parts.find(p => p.type === "year").value;
  const m = parts.find(p => p.type === "month").value;
  const day = parts.find(p => p.type === "day").value;
  return `${y}-${m}-${day}`;
}

function getLastNDaysYYYYMMDD(n = 7) {
  const out = [];
  const now = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(toJakartaYYYYMMDD(d));
  }
  return out;
}

function getLastNBusinessDaysYYYYMMDD(n = 5) {
  const out = [];
  const now = new Date();

  let cursor = new Date(now);

  while (out.length < n) {
    if (isBusinessDayJakarta(cursor)) {
      out.push(toJakartaYYYYMMDD(cursor));
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  // reverse so chart goes oldest -> newest
  return out.reverse();
}


export function buildWeeklyCaseTypeSeries(cases, { days = 7 } = {}) {
  const dateKeys = getLastNDaysYYYYMMDD(days);

  // seed output so missing days still appear as 0
  const map = new Map(
    dateKeys.map(date => [date, { date, bench: 0, onsite: 0 }])
  );

  for (const row of cases || []) {
    const caseType = row?.caseinformation?.CaseType; // "Bench" / "Onsite"
    if (caseType !== "Bench" && caseType !== "Onsite") continue;

    const createdOn = row?.caseinformation?.CreatedOn;
    if (!createdOn) continue;

    const dayKey = toJakartaYYYYMMDD(createdOn);
    if (!map.has(dayKey)) continue; // outside last 7 days

    const bucket = map.get(dayKey);
    if (caseType === "Bench") bucket.bench += 1;
    if (caseType === "Onsite") bucket.onsite += 1;
  }

  return dateKeys.map(d => map.get(d));
}

export function buildBusinessDayCaseTypeSeries(cases, user, { businessDays = 5 } = {}) {
  const dateKeys = getLastNBusinessDaysYYYYMMDD(businessDays);

  const map = new Map(
    dateKeys.map(date => [date, { date, bench: 0, onsite: 0 }])
  );

  for (const row of cases || []) {
    const caseType = row?.caseinformation?.CaseType; // "Bench" / "Onsite"
    if (caseType !== "Bench" && caseType !== "Onsite") continue;

   const createdBy = row?.caseinformation?.CreatedBy;
    if (createdBy !== user?.id) continue;

    const createdOn = row?.caseinformation?.CreatedOn;
    if (!createdOn) continue;

    // Skip weekend cases entirely (even if they exist in the range)
    if (!isBusinessDayJakarta(createdOn)) continue;

    const dayKey = toJakartaYYYYMMDD(createdOn);
    if (!map.has(dayKey)) continue;

    const bucket = map.get(dayKey);
    if (caseType === "Bench") bucket.bench += 1;
    if (caseType === "Onsite") bucket.onsite += 1;
  }

  return dateKeys.map(d => map.get(d));
}


// export function buildBusinessDayCreatedCaseBySeries(cases, user, { businessDays = 5 } = {}) {
//   const dateKeys = getLastNBusinessDaysYYYYMMDD(businessDays);
//
//   const map = new Map(
//     dateKeys.map(date => [date, { date, bench: 0, onsite: 0 }])
//   );
//
//   for (const row of cases || []) {
//     const caseType = row?.caseinformation?.CreatedType;
//     // const createdBy = row?.caseinformation?.CreatedBy;
//     if (caseType !== "Bench" && caseType !== "Onsite") continue;
//
//     const createdOn = row?.caseinformation?.CreatedOn;
//     if (!createdOn) continue;
//
//     // Skip weekend cases entirely (even if they exist in the range)
//     if (!isBusinessDayJakarta(createdOn)) continue;
//
//     const dayKey = toJakartaYYYYMMDD(createdOn);
//     if (!map.has(dayKey)) continue;
//
//     const bucket = map.get(dayKey);
//     if (caseType === "Bench") bucket.bench += 1;
//     if (caseType === "Onsite") bucket.onsite += 1;
//   }
//
//   return dateKeys.map(d => map.get(d));
// }
