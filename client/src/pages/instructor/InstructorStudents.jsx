import React, { useEffect, useState } from 'react';
import InstructorLayout from '../../layouts/InstructorLayout';
import { courseEndpoints } from '../../api/endpoints/courseEndpoints';
import { fetchResponse } from '../../api/service';
import { toast } from 'react-toastify';
import { toastErrorObject } from '../../utility/toasts';
import DynamicTable from '../../components/tables/DynamicTable';
import SelectField from '../../components/inputs/SelectField';
import moment from 'moment';

export default function InstructorStudents() {
  const uniqueCourseIds = {};
  const instructorId = JSON.parse(localStorage.getItem('instructor'))._id;

  const [students, setStudents] = useState([]);
  const [temporarySelection, setTemporarySelection] = useState({
    date: moment(Date.now()).format('YYYY-MM-DD'),
    course: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        let res;
        res = await fetchResponse(
          courseEndpoints.getStudentsOfInstructor(instructorId),
          0,
          null
        );
        const resData = res.data;
        if (!res.success) {
          toast.error(res.message, toastErrorObject);
          setIsLoading(false);
          return;
        }
        console.log('Log data', resData);
        const sortedStudents = resData?.sort((a, b) => {
          const fnameComparison = a.fname.localeCompare(b.fname);
          if (fnameComparison !== 0) {
            return fnameComparison;
          }
          return a.lname.localeCompare(b.lname);
        });
        setStudents(
          sortedStudents?.map((student) => ({
            ...student,
            name: student.fname + ' ' + student.lname,
          }))
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [instructorId]);

  return (
    <InstructorLayout isLoading={isLoading}>
      <div className='mb-4'>
        <SelectField
          label={'Select Course'}
          options={students
            .filter((attendance) => {
              const courseId = attendance.courseId;
              if (!uniqueCourseIds[courseId]) {
                uniqueCourseIds[courseId] = true;
                return true;
              }
              return false;
            })
            .sort((a, b) => a.courseTitle.localeCompare(b.courseTitle))
            .map((attendance) => ({
              value: attendance.courseId,
              title: attendance.courseTitle,
            }))}
          value={temporarySelection?.course}
          onChange={(event) =>
            setTemporarySelection({
              ...temporarySelection,
              course: event.target.value,
            })
          }
        />
      </div>
      <DynamicTable
        styles={'table-bordered'}
        headers={['Roll Number', 'Name', 'Email Address', 'Joining Date']}
        data={students?.filter(
          (student) => student?.courseId === temporarySelection.course
        )}
        dataAttributes={['rollNumber', 'name', 'email', 'createdAt']}
      />
    </InstructorLayout>
  );
}
