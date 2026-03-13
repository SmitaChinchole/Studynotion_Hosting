/*import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({course, Height}) => {
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(() => {
        // Safe rating calculation - NO CRASH
        const reviews = course?.ratingAndReviews || [];
        const count = reviews.length > 0 ? reviews[0]?.rating || 0 : 0;
        setAvgReviewCount(count);
    }, [course]);

    return (
        <div className="course-card p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link to={`/courses/${course?._id || ''}`} className="block">
                <div>
                    {/* Thumbnail - Safe fallback //
                    <img 
                        src={course?.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={course?.courseName || 'Course Thumbnail'}
                        className={`${Height} w-full rounded-xl object-cover mb-3`}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                    />
                    
                    {/* Course Details //
                    <div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">
                            {course?.courseName || 'Course Name'}
                        </h3>
                        
                        {/* Instructor - SAFE //
                        <p className="text-sm text-gray-600 mb-3">
                            Instructor
                        </p>
                        
                        {/* Rating - SAFE //
                        <div className="flex items-center gap-x-2 mb-3">
                            <span className="font-semibold text-lg">
                                {avgReviewCount || 0}
                            </span>
                            <div className="flex text-yellow-400">
                                <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                            </div>
                            <span className="text-xs text-gray-500">
                                ({(course?.ratingAndReviews?.length || 0)} ratings)
                            </span>
                        </div>
                        
                        {/* Price //
                        <p className="font-bold text-xl text-green-600">
                            ₹{course?.price || 0}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Course_Card*/
// src/components/core/Course_Card.jsx
import React, { useEffect, useState } from 'react';
import RatingStars from '../../common/RatingStars';
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({course, Height}) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    // ✅ SAFE CALL - prevents crashes
    if (course?.ratingAndReviews && Array.isArray(course.ratingAndReviews)) {
      try {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count || 0);
      } catch (error) {
        console.log("Rating calc error:", error);
        setAvgReviewCount(0);
      }
    }
  }, [course]);

  return (
    <>
      <Link to={`/courses/${course?._id || '#'}`}>
        <div className="group hover:shadow-lg transition-all">
          <div className="rounded-lg overflow-hidden">
            <img
              src={course?.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt="course thumbnail"
              className={`${Height} w-full rounded-xl object-cover`}
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5 line-clamp-2">
              {course?.courseName || 'Course Name'}
            </p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName || ''} {course?.instructor?.lastName || ''}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5 font-medium">
                {avgReviewCount?.toFixed(1) || 0}
              </span>
              <RatingStars Review_Count={avgReviewCount || 0} />
              <span className="text-richblack-400 text-xs">
                {course?.ratingAndReviews?.length || 0} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5 font-semibold">
              Rs. {course?.price || 0}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Course_Card;
