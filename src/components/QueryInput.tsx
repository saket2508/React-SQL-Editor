export default function Editor() {
  return (
    <div className="col-10 col-sm-6 mb-4">
      <textarea
        placeholder="SELECT * FROM Products"
        className="editorInput"
        rows={3}
      />
    </div>
  );
}
