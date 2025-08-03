import {useEffect,useState} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Problem from './Problem';


function Home() {
    const [problems,setproblems] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
       const getProblems = async () =>{ 
            try{
                const response = await axiosPrivate.get('/');
                setproblems(response.data);
            }catch(err){
                console.error(err);
                navigate('/auth',{state : {from : location},replace : true});
            }
        }
      getProblems();    
    },[]);


    return (
    <section className="max-w-3xl mx-auto w-full space-y-4">
      {problems.map((p, idx) => (
        <article
          key={p._id}
          className="flex items-center justify-between
                     bg-transparent backdrop-blur-sm
                     border border-gray-700
                     rounded-lg p-4 hover:border-indigo-400
                     transition"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-100">
              {idx + 1}.
             <Link
            to={`/problems/${p._id}`}
            state={{
              title:     p.title,
              statement: p.statement,
              examples:  p.example
            }}
           >
            {  p.title}
            </Link>
            </h3>
           <p className="text-sm text-gray-400 mt-1">{p.description}</p>
          </div>
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${p.difficulty === "Hard"   ? "bg-red-700 text-red-300"   : ""}
              ${p.difficulty === "Medium" ? "bg-yellow-700 text-yellow-300" : ""}
              ${p.difficulty === "Easy"   ? "bg-green-700 text-green-300" : ""}
            `}
          >
            {p.difficulty}
          </span>
        </article>
      ))}
    </section>
  
    );
}

export default Home;