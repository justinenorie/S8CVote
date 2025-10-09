import Typography from "@renderer/components/ui/Typography";
import FileUpload from "@renderer/components/students/FileUpload";
import { DataTable } from "@renderer/components/ui/DataTable";
import { useStudentColumns } from "@renderer/components/students/columns";

const sampleDataStudent = [
  {
    id: "1",
    student_id: "2023-0001",
    fullname: "John Doe",
    email: "john.doe@example.com",
    isRegistered: true,
  },
  {
    id: "2",
    student_id: "2023-0002",
    fullname: "Jane Smith",
    email: "jane.smith@example.com",
    isRegistered: false,
  },
  {
    id: "3",
    student_id: "2023-0003",
    fullname: "Peter Jones",
    email: "peter.jones@example.com",
    isRegistered: true,
  },
];

const Students = (): React.JSX.Element => {
  const columns = useStudentColumns();
  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-7">
      <header>
        <Typography variant="h1" className="font-normal">
          Students
        </Typography>
        <Typography
          variant="p"
          className="text-TEXTdark/60 dark:text-TEXTlight/60"
        >
          View and manage the list of students for voter verification
        </Typography>
      </header>
      <div>
        <FileUpload />
      </div>
      <DataTable
        data={sampleDataStudent}
        columns={columns}
        defaultSorting={[{ id: "fullname", desc: false }]}
      />
    </div>
  );
};

export default Students;
