import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resume} from "react-dom/server";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useLocation, useNavigate} from "react-router";
import {use, useEffect, useState} from "react";
import Resume from "~/routes/resume";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumatch" },
    { name: "description", content: "Smart feedback of your resume" },
  ];
}

export default function Home() {
  const {auth,kv} = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadindResumes, setLoadindResumes] = useState(false);


  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
      const loadResumes= async ()=>{
        setLoadindResumes(true);

        const resumes=(await kv.list('resume:*',true)) as KVItem[];

        const parsedResumes= resumes?.map((resume)=>(
            JSON.parse(resume.value) as Resume
        ))

        console.log("Parsed Resumes", parsedResumes);
        setResumes(parsedResumes || []);
        setLoadindResumes(false);
      }

      loadResumes();

  }, []);

  // useEffect(() => {
  //   const loadResume=async ()=>{
  //     const blob= await fs.read(resume.imagePath);
  //     if(!blob) return;
  //     let url=URL.createObjectURL(blob);
  //   }
  //
  //   loadResume();
  // }, [resume.imagePath]);

  return <main className="bg-[url('/image/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track your Applications and Resume Ratings</h1>
        {!loadindResumes && resumes?.length===0 ?(
            <h2> No resumes found. Upload your first resume to get started.</h2>
        ):(
            <h2> Review your submissions and check how close you are to your Dream Job </h2>
        )}
      </div>

      {loadindResumes && (
          <div className="flex flex-col items-center justify-center">
            <img
              src="/image/resume-scan-2.gif" className="w-[200px]"
            />
          </div>
      )}
      {!loadindResumes && resumes.length >0 && (
          <div className="resumes-section">
            {resumes.map((resume)=>(
                <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
      )}

      {!loadindResumes && resumes?.length===0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
              <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                  Upload Your First Resume
              </Link>
          </div>
      )}
    </section>


  </main>
}
