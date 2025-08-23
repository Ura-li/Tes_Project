export default function ContactForm({
  formDataContact,
  handlerInputContactChange,
  handlerContactSubmit,
  handleClearAllContact,
  citiesContact,
  provinces,
}) {
  return (
    <Card className="drop-shadow-md">
      <CardHeader className="flex-row justify-between">
        <CardTitle>Basic Information</CardTitle>
        <div>
          <Button className="bg-white text-gray-400 self-end">
            <Copy className="mr-1" /> Same in Account Address
          </Button>
          <Button
            className="self-end ml-2"
            variant="ghost"
            onClick={handleClearAllContact}
          >
            Clear All
          </Button>
        </div>
      </CardHeader>

      {/* ...lanjutkan isi form persis seperti yang kamu tulis */}
      {/* tinggal copy field dari Contact ke sini */}
      
      <CardFooter className="flex justify-end gap-4">
        <Button
          variant="secondary"
          className="bg-white drop-shadow-md border cursor-pointer"
          onClick={handlerContactSubmit}
        >
          Save
        </Button>
        <Button
          variant="secondary"
          className="bg-white drop-shadow-md border cursor-pointer"
          onClick={handlerContactSubmit}
        >
          Verify & Save
        </Button>
      </CardFooter>
    </Card>
  );
}
