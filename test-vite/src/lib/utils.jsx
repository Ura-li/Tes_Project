export function parseNoteText(note) {
  if (!note) return null;

  // Regex cari [WARNING] dan potong kalimatnya
  const parts = note.split(/(\[WARNING\]|\[NOTICE\]|\[PRINT\]|\[QUOTATION\]|\[INVOICE\]|\[DP\]|\[RMA\])/g);

  return parts.map((part, idx) => {
    if (part === "[WARNING]") {
      return (
        <span key={idx} className="text-red-600 font-semibold">
          ⚠️ WARNING
        </span>
      );
    } else if(part === "[NOTICE]"){
      return (
        <span key={idx} className="text-yellow-600 font-semibold">
          ⚠️ NOTICE
        </span>
      );
    } else if(part === "[PRINT]"){
      return(
        <span key={idx} className="text-green-400 font-semibold">
          ⚠️ PRINT
        </span>
      )
    } else if(part === "[QUOTATION]"){
      return(
        <span key={idx} className="text-gray-400 font-semibold">
          ⚠️ QUOTATION NOTICE
        </span>
      )
    } else if(part === "[INVOICE]"){
      return(
        <span key={idx} className="text-gray-400 font-semibold">
          ⚠️ INVOICE
        </span>
      )
    } else if(part === "[DP]"){
      return(
        <span key={idx} className="text-gray-400 font-semibold">
          ⚠️ DP NOTICE
        </span>
      )
    } else if(part === "[RMA]"){
      return(
        <span key={idx} className="text-gray-400 font-semibold">
          ⚠️ Update RMA Notice
        </span>
      )
    }
    else {
      return <span key={idx}>{part}</span>;
    }
  });
}