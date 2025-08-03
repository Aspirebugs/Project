// ProblemComponent.jsx
import { useState,useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import {useNavigate,useLocation} from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-solarizedlight.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Problem() {
    const [code, setCode] = useState('#include <iostream>\nint main()\n { \n std::cout << "Hello World!" << std::endl;\nreturn 0;\n}');
    const [outputs, setOutputs] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const {examples,title,statement} = location.state;
  useEffect(() => {
         const getPage = async () =>{ 
              try{
                  const response = await axiosPrivate.get('/');
              }catch(err){
                  console.error(err);
                  navigate('/auth',{state : {from : location},replace : true});
              }
          }
        getPage();    
      },[]);
  
  const handleRun = async () => {
    // In production, you'd POST code/examples to backend compiler
    // Here we simulate by echoing example outputs:
    const outs = examples.map(ex => ex.output);
    setOutputs(outs);
  };

  return  (
    <div
      className="
        h-screen flex
        bg-gradient-to-br 
          from-gray-900 via-blue-900 to-gray-700
      "
    >
      {/* Left pane */}
      <aside className="w-1/3 p-6 overflow-y-auto">
        {/* Frosted panel */}
        <div className="bg-transparent backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-gray-100">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <div className="prose prose-invert mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {statement}
            </ReactMarkdown>
          </div>
          <h2 className="text-xl font-semibold mb-3">Examples</h2>
          <div className="space-y-4">
            {examples.map((ex, i) => (
              <div key={i} className="bg-gray-800 bg-opacity-50 p-4 rounded">
                  <pre className="whitespace-pre-wrap bg-gray-900 p-2 rounded mt-1 text-sm">
                    {ex}
                  </pre>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Right pane */}
      <main className="w-2/3 flex flex-col p-6">
        {/* Editor panel */}
        <div className="flex-1 bg-transparent backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => highlight(code, languages.js)}
            padding={12}
            style={{ fontFamily: 'Fira Code, monospace', fontSize: 14 }}
            textareaClassName="w-full h-full bg-transparent text-blue-100 focus:outline-none p-4"
          />
        </div>

        {/* Run + Output */}
        <div className="mt-4 bg-transparent backdrop-blur-sm border border-gray-700 rounded-2xl p-4 text-gray-100">
          <button
            onClick={handleRun}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white transition"
          >
            Run
          </button>
          <div className="mt-4 space-y-2">
            {outputs.length === 0
              ? <div className="text-gray-400">Press “Run” to see output</div>
              : outputs.map((out, idx) => (
                  <pre
                    key={idx}
                    className="bg-gray-900 p-3 rounded whitespace-pre-wrap text-sm"
                  >
                    {out}
                  </pre>
                ))
            }
          </div>
        </div>
      </main>
    </div>
  );
}
