import { useState } from "react";
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App() {
  // Phần sử dụng excel
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // Phần submit state
  const [excelData, setExcelData] = useState(null);

  // Xử lý sự kiện
  const handleFile = (e) => {
    let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError('Vui lòng chỉ lựa chọn file excel');
        setExcelFile(null);
      }
    } else {
      console.log('Vui lòng lựa chọn File');
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();  // Sửa lỗi chính tả preventDefault
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 10));  // Giới hạn dữ liệu để tránh quá tải
    }
  };

  return (
    <div className="wrapper">
      <h3>File Excel Sheets</h3>
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>  {/* Sửa thẻ from thành form */}
        <input type="file" className="form-control" required onChange={handleFile} />
        <button type="submit" className="btn btn-success btn-md">Đăng tải</button>
        {typeError && (
          <div className="alert alert-danger" role="alert">{typeError}</div>
        )}
      </form>

      <div className="viewer">
        {excelData ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key}>{individualExcelData[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>Không có file upload</div>
        )}
      </div>
    </div>
  );
}

export default App;
