import React, { useEffect, useMemo, useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-okaidia.css"; // dark-ish theme; swap if you prefer
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";



const DEFAULT_TEMPLATES = {
  cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // write your solution here
    return 0;
}`
};


export default function Problem() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { problemId } = useParams();


  const locState = location.state || {};
  const title = locState.title ?? `Problem ${problemId ?? ""}`;
  const statement = locState.statement ?? "No statement provided.";
  const examples = locState.examples ?? [];

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_TEMPLATES.cpp);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null); 
  const [outputLog, setOutputLog] = useState(""); // textual output / summary
  const [activeTab, setActiveTab] = useState("statement"); // statement / discussion / submissions

  useEffect(() => {
    // change template when language changes if current code is default template
    setCode((prev) => {
      // if prev equals the old language template, replace, else keep user's code
      const otherTemplates = Object.values(DEFAULT_TEMPLATES);
      const isDefault = otherTemplates.includes(prev);
      if (isDefault) return DEFAULT_TEMPLATES[language];
      return prev;
    });
  }, [language]);

  const handleRun = async () => {
    setRunning(true);
    setResults(null);
    setOutputLog("");
    try {
      const payload = { problemId, code, language };
      const res = await axiosPrivate.post("/run", payload, { timeout: 60000 });
      
      const data = res.data ?? res;
      // normalize
      if (data.stat) {
        // short response
        setResults([data]);
        setOutputLog(`${data.stat} : ${data.problem ?? ""}`);
      } else {
        setResults(data.results ?? []);
        const okCount = (data.results ?? []).filter((r) => r.stat === "OK").length;
        setOutputLog(`Passed ${okCount}/${(data.results ?? []).length}`);
      }
    } catch (err) {
      console.error("Run error", err);
      setOutputLog("Error running code. See console for details.");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    // For now we re-use run endpoint.
    setRunning(true);
    setResults(null);
    setOutputLog("");
    try {
      const payload = { problemId, code, language };
      const res = await axiosPrivate.post("/run", payload, { timeout: 120000 });
      const data = res.data ?? res;
      if (data.stat) {
        setResults([data]);
        setOutputLog(`${data.stat} : ${data.problem ?? ""}`);
      } else {
        setResults(data.results ?? []);
        const okCount = (data.results ?? []).filter((r) => r.stat === "OK").length;
        setOutputLog(`Submission: Passed ${okCount}/${(data.results ?? []).length}`);
      }
    } catch (err) {
      console.error("Submit error", err);
      setOutputLog("Error submitting code. See console.");
    } finally {
      setRunning(false);
    }
  };

  // small helper for badges
  const statusBadge = (s) =>
    clsx(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
      s === "OK" && "bg-green-700 text-green-100",
      s === "WRONG_ANSWER" && "bg-yellow-700 text-yellow-100",
      s === "RUNTIME_ERROR" && "bg-red-700 text-red-100",
      s === "TIMEOUT" && "bg-purple-700 text-purple-100",
      s === "COMPILE_ERROR" && "bg-red-800 text-red-100",
      !s && "bg-gray-700 text-gray-100"
    );

    function withLineNumbers(highlightedHtml) {
        const lines = highlightedHtml.split('\n');

        return lines
          .map((line, i) => {
            const ln = i + 1;

            // line wrapper (block) + left padding to make room for numbers
            const lineWrapperStyle =
              'display:block;position:relative;padding-left:3.2em;min-height:1.4em;';

            // the actual line-number gutter
            const numberStyle = [
              'position:absolute',
              'left:0',
              'top:0',
              'bottom:0',
              'width:2.8em',
              'padding-right:0.4em',
              'text-align:right',
              'color:#9CA3AF', // tailwind gray-400-ish
              'opacity:0.8',
              'user-select:none',
              'font-variant-numeric:tabular-nums',
              'border-right:1px solid rgba(255,255,255,0.08)'
            ].join(';');

            return `<span style="${lineWrapperStyle}">
              <span style="${numberStyle}">${ln}</span>${line || '&nbsp;'}
            </span>`;
          })
          .join('\n');
      }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 text-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* header */}
        <header className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>

          <div className="space-x-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 text-gray-100 rounded px-3 py-1"
            >
              <option value="cpp">C++</option>
              {/*<option value="c">C</option>
              <option value="javascript">JavaScript (Node)</option>
              <option value="python">Python</option>*/}
            </select>

            <button
              onClick={handleRun}
              disabled={running}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-medium disabled:opacity-60"
            >
              {running ? "Running..." : "Run"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={running}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-medium disabled:opacity-60"
            >
              {running ? "Submitting..." : "Submit"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* left column: statement */}
          <section className="col-span-5">
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Problem</h2>
                <div className="flex space-x-2 text-xs">
                  <button
                    onClick={() => setActiveTab("statement")}
                    className={clsx(
                      "px-2 py-1 rounded",
                      activeTab === "statement" ? "bg-indigo-600" : "bg-gray-800"
                    )}
                  >
                    Statement
                  </button>
                  <button
                    onClick={() => setActiveTab("discussion")}
                    className={clsx(
                      "px-2 py-1 rounded",
                      activeTab === "discussion" ? "bg-indigo-600" : "bg-gray-800"
                    )}
                  >
                    Discussion
                  </button>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className={clsx(
                      "px-2 py-1 rounded",
                      activeTab === "submissions" ? "bg-indigo-600" : "bg-gray-800"
                    )}
                  >
                    Submissions
                  </button>
                </div>
              </div>

              {activeTab === "statement" && (
                <div className="overflow-auto max-h-[70vh] pr-2">
                  <div className="prose prose-invert mb-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{statement}</ReactMarkdown>
                  </div>

                  <h3 className="mt-4 mb-2 font-semibold">Examples</h3>
                  <div className="space-y-3">
                    {examples.map((ex, i) => (
                      <div key={i} className="bg-gray-800 p-3 rounded">
                        <pre className="whitespace-pre-wrap text-sm bg-gray-900 p-2 rounded">{ex}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "discussion" && (
                <div className="text-sm text-gray-300">Discussion / editorial placeholder.</div>
              )}

              {activeTab === "submissions" && (
                <div className="text-sm text-gray-300">User submissions placeholder.</div>
              )}
            </div>
          </section>

          {/* right column: editor + output */}
          <section className="col-span-7 flex flex-col">
            <div className="flex-1 bg-gray-900/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 flex flex-col">
              {/* Editor */}
              <div className="flex-1 mb-4 min-h-[300px] overflow-hidden rounded">
                <Editor
                  value={code}
                  onValueChange={(val) => setCode(val)}
                  highlight={(codeText) => {
                    // pick prism language
                    if (language === "cpp") return highlight(codeText, languages.cpp);
                    if (language === "c") return highlight(codeText, languages.c);
                    if (language === "javascript") return highlight(codeText, languages.javascript);
                    if (language === "python") return highlight(codeText, languages.python);
                    const highlighted =  highlight(codeText, languages.cpp);
                    return withLineNumbers(highlighted);
                  }}
                  padding={16}
                  style={{
                    fontFamily: '"Fira Code", monospace',
                    fontSize: 14,
                    outline: "none",
                    minHeight: "40vh"
                  }}
                  textareaClassName="bg-transparent text-gray-100 p-3 focus:outline-none"
                />
              </div>

              {/* Output area */}
              <div className="border-t border-gray-700 pt-3">
          
                {/* If results is an array, show per-test */}
                {Array.isArray(results) && results.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {results.map((r, idx) => (
                      <div key={idx} className="flex items-start justify-between bg-gray-900 p-2 rounded">
                        <div>
                          <div className="text-sm">
                            <span className={statusBadge(r.stat)}>{r.stat}</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-300">
                            <div><strong>Output:</strong></div>
                            <pre className="whitespace-pre-wrap text-sm bg-gray-800 p-2 rounded">{r.output ?? ""}</pre>
                            {r.problem && <div className="mt-1 text-red-300 text-xs">{r.problem}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-900 p-3 rounded text-sm text-gray-300 whitespace-pre-wrap min-h-[80px]">
                    {results === null ? "Press Run to execute on sample tests" : outputLog}
                  </div>
                )}
              </div>
            </div>

            {/* quick footer */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <div>Memory/time limits: 256MB / 2s (testcase)</div>
              <div>Language: {language.toUpperCase()}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
