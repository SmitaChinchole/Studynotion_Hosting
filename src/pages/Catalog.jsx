/*import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';

const Catalog = () => {
    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(true);

    // Step 1: Fetch all categories → Get categoryId
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                
                // Find matching category
                const category_id = res?.data?.data?.filter((ct) => 
                    ct.name.split(" ").join("-").toLowerCase() === catalogName
                )[0]?._id;
                
                console.log("🔍 URL:", catalogName);
                console.log("🔍 Found categoryId:", category_id);
                console.log("🔍 All categories:", res?.data?.data?.map(c => c.name));
                
                setCategoryId(category_id);
            } catch (error) {
                console.log("❌ Categories fetch failed:", error);
                setCategoryId(null);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, [catalogName]);

    // Step 2: Fetch catalog page data with categoryId
    useEffect(() => {
        const fetchCatalogData = async () => {
            if (!categoryId) {
                console.log("⏳ Waiting for categoryId...");
                return;
            }

            try {
                setLoading(true);
                console.log("🔍 Fetching catalog data for ID:", categoryId);
                const res = await getCatalogaPageData(categoryId);
                console.log("✅ Catalog data received:", res);
                setCatalogPageData(res);
            } catch (error) {
                console.error("❌ Catalog API 404:", error.response?.status);
                console.error("❌ URL was:", error.config?.url);
                setCatalogPageData(null);
            } finally {
                setLoading(false);
            }
        }

        fetchCatalogData();
    }, [categoryId]);

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen text-white'>
                <div>Loading catalog...</div>
            </div>
        );
    }

    if (!catalogPageData) {
        return (
            <div className='flex justify-center items-center min-h-screen text-white'>
                <div>Category not found</div>
            </div>
        );
    }

    return (
        <div className='text-white'>
            <div className='py-8 px-4'>
                <p>{`Home / Catalog / ${catalogPageData?.data?.selectedCategory?.name}`}</p>
                <h1 className='text-3xl font-bold my-4'>{catalogPageData?.data?.selectedCategory?.name}</h1>
                <p className='text-richblack-400'>{catalogPageData?.data?.selectedCategory?.description}</p>
            </div>

            <div className='px-4 pb-8'>
                {/* Section 1: Courses to get you started */
               /* <div className='mb-12'>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl font-bold'>Courses to get you started</h2>
                        <div className='flex gap-x-3'>
                            <button className='px-4 py-2 bg-richblack-700 rounded-lg'>Most Popular</button>
                            <button className='px-4 py-2 bg-richblack-700 rounded-lg'>New</button>
                        </div>
                    </div>
                    <CourseSlider courses={catalogPageData?.data?.selectedCategory?.courses || []} />
                </div>

                {/* Section 2: Top courses in this category */
               /* <div className='mb-12'>
                    <h2 className='text-2xl font-bold mb-6'>
                        Top Courses in {catalogPageData?.data?.selectedCategory?.name}
                    </h2>
                    <CourseSlider courses={catalogPageData?.data?.differentCategory?.courses || []} />
                </div>

                {/* Section 3: Frequently Bought */
               /* <div>
                    <h2 className='text-2xl font-bold mb-8'>Frequently Bought</h2>
                    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6'>
                        {catalogPageData?.data?.mostSellingCourses?.slice(0, 8).map((course, index) => (
                            <Course_Card 
                                key={course._id || index} 
                                course={course} 
                                Height={"h-[250px]"}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

//export default Catalog */

//2.
import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"

const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = 
            res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogaPageData(categoryId);
                console.log("PRinting res: ", res);
                setCatalogPageData(res);
            }
            catch(error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);


    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
      if (!loading && !catalogPageData.success) {
        return <Error />
      }
    
      return (
        <>
          {/* Hero Section */}
          <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                  {catalogPageData?.data?.selectedCategory?.name}
                </span>
              </p>
              <p className="text-3xl text-richblack-5">
                {catalogPageData?.data?.selectedCategory?.name}
              </p>
              <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.description}
              </p>
            </div>
          </div>
    
      {/* Section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Popular
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}
              >
                New
              </p>
            </div>
            <div>
              <CourseSlider
                Courses={catalogPageData?.data?.selectedCategory?.courses}
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top courses in {catalogPageData?.data?.differentCategory?.name}
            </div>
            <div className="py-8">
              <CourseSlider
                Courses={catalogPageData?.data?.differentCategory?.courses}
              />
            </div>
          </div>
    
          {/* Section 3 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {catalogPageData?.data?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, i) => (
                    <Course_Card course={course} key={i} Height={"h-[400px]"} />
                  ))}
              </div>
            </div>
          </div>
    
          <Footer />
        </>
      )
    }
    
    export default Catalog 



