import React, { useEffect, useState } from 'react'
import { fetchResponse } from "../../api/service";
import { courseEndpoints } from "../../api/endpoints/courseEndpoints";
import { toast } from "react-toastify";
import { toastErrorObject } from "../../utility/toasts";
import InstructorLayout from '../../layouts/InstructorLayout';
import OfferCourseTable from '../../components/tables/OfferCourseTable';

export default function InstructorCourses() {
  const instructorId = JSON.parse(localStorage.getItem("instructor"))._id;

  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOfferedCoursesData() {
      try {
        let res;
        res = await fetchResponse(
          courseEndpoints.getCoursesOfInstructor(instructorId),
          0,
          null
        );
        const resData = res.data;
        if (!res.success) {
          toast.error(res.message, toastErrorObject);
          setIsLoading(false);
          return;
        }
        console.log("Log data", resData);
        setCourses(resData?.sort((a, b) => a.title.localeCompare(b.title)));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchOfferedCoursesData();

    async function fetchCoursesData() {
      try {
        let res;
        res = await fetchResponse(
          courseEndpoints.getCourses(),
          0,
          null
        );
        const resData = res.data;
        if (!res.success) {
          toast.error(res.message, toastErrorObject);
          setIsLoading(false);
          return;
        }
        console.log("Log data", resData);
        setAllCourses(resData?.sort((a, b) => a.title.localeCompare(b.title)));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchCoursesData();
  }, [instructorId]);

  async function offerCourse(item) {
    let result = window.confirm("Are you sure to Offer this Course?");
    if (!result) return;
    setIsLoading(true);
    try {
      let res;
      res = await fetchResponse(
        courseEndpoints.offerCourse(),
        1,
        {instructorId, courseId: item._id}
      );
      const resData = res.data;
      if (!res.success) {
        toast.error(res.message, toastErrorObject);
        setIsLoading(false);
        return;
      }
      console.log("Log data", resData);
      
      // updating state
      let duplicateArray = [...courses];
      duplicateArray.push(item);
      setCourses(duplicateArray);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <InstructorLayout isLoading={isLoading}>
      <OfferCourseTable
        styles={"table-bordered"}
        headers={[
          "Title",
          "Code",
          "Type",
          "Credit Hours",
          "Fee",
          "Offer Date",
          "Action"
        ]}
        data={allCourses}
        dataAttributes={["title", "code", "type", "creditHours", "fee", "createdAt"]}
        handleAction={offerCourse}
        notOffered={allCourses.filter(item1 => !courses.map(item2 => item2._id).includes(item1._id))}
      />
    </InstructorLayout>
  );
}
