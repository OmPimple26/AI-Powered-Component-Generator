import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    {
      value: "html-tailwind-bootstrap",
      label: "HTML + Tailwind CSS + Bootstrap",
    },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  function extractCode(response) {
    // Regex se triple bracket ke andar ka code extract karo
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // console.log('Content copied to clipboard');
      toast.success("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy code.");
    }
  };

  const downloadFile = () => {
    try {
      const fileName = "GenUI-Component.html";
      const blob = new Blob([code], { type: "text/plain" });
      let url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("File downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download file.");
    }
  };

  const ai = new GoogleGenAI({
    apiKey: "",
  });

  async function getResponse() {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: ` You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
The code must be clean, well-structured, and easy to understand.  
Optimize for SEO where applicable.  
Focus on creating a modern, animated, and responsive UI design.  
Include high-quality hover effects, shadows, animations, colors, and typography.  
Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
Do NOT include explanations, text, comments, or anything else besides the code.  
And give the whole code in a single HTML file.`,
    });
    console.log(extractCode(response.text));
    // setTab(2);
    setCode(extractCode(response.text));
    setOutputScreen(true);
    setLoading(false);
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#09090B",
      borderColor: "#27272a",
      color: "#fff",
      minHeight: "44px",
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#09090B",
      border: "1px solid #27272a",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#1f1f23" : "#09090B",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6b7280",
    }),
  };

  return (
    <>
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-8 py-8 flex gap-8">
        {/* LEFT PANEL */}
        <div className="w-1/2 bg-[#141319] rounded-2xl p-7 border border-[#262626] shadow-lg">
          <h3 className="text-2xl font-semibold text-white">
            AI Component Generator
          </h3>

          <p className="text-gray-400 mt-2 text-sm">
            Describe your component and let AI generate the code for you.
          </p>

          {/* Framework */}
          <div className="mt-7">
            <p className="text-sm font-semibold text-gray-300 mb-2">
              Framework
            </p>

            <Select
              options={options}
              styles={customStyles}
              placeholder="Select framework"
              onChange={(e) => {
                // console.log(e);
                setFrameWork(e.value);
              }}
            />
          </div>

          {/* Textarea */}
          <div className="mt-7">
            <p className="text-sm font-semibold text-gray-300 mb-2">
              Describe your component
            </p>

            <textarea
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              value={prompt}
              className="w-full min-h-[190px] rounded-xl bg-[#09090B] border border-[#262626] p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              placeholder="Example: Create a responsive pricing card with 3 plans and a gradient button..."
            />
          </div>

          {/* Button Section */}
          <div className="flex items-center justify-between mt-7">
            <p className="text-gray-400 text-sm">
              Click on generate to create your component
            </p>

            <button
              onClick={getResponse}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-6 py-2.5 rounded-lg shadow-md transition-all duration-300 hover:from-purple-500 hover:to-purple-700 hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {loading === false ? (
                <>
                  <i>
                    <BsStars size={18} />
                  </i>
                </>
              ) : (
                ""
              )}
              {loading === true ? (
                <>
                  <ClipLoader size={20} color="white" />
                </>
              ) : (
                ""
              )}
              Generate
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right relative w-1/2 h-[75vh] bg-[#141319] rounded-2xl border border-[#262626] shadow-lg overflow-hidden flex flex-col">
          {outputScreen === false ? (
            <>
              {/* {loading === true ? (
                <>
                  <div className="loader absolute left-0 top-0 w-full h-full flex items-center justify-center bg-[#141319]/80 backdrop-blur-sm z-10">
                    <ClipLoader />
                  </div>
                </>
              ) : (
                ""
              )} */}
              <div className="skeleton w-full h-full flex flex-col items-center justify-center text-center">
                <div className="p-5 w-[70px] h-[70px] flex items-center justify-center text-3xl rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg">
                  <HiOutlineCode />
                </div>

                <p className="text-gray-400 mt-4 text-sm">
                  Your generated component and code will appear here
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Tabs */}
              <div className="bg-[#17171C] w-full h-[56px] flex items-center gap-2 px-3 border-b border-[#2a2a2a]">
                <button
                  onClick={() => setTab(1)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${
            tab === 1
              ? "bg-indigo-600 text-white shadow"
              : "bg-[#1F2937] text-gray-300 hover:bg-[#2a2a35]"
          }`}
                >
                  Code
                </button>

                <button
                  onClick={() => setTab(2)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${
            tab === 2
              ? "bg-indigo-600 text-white shadow"
              : "bg-[#1F2937] text-gray-300 hover:bg-[#2a2a35]"
          }`}
                >
                  Preview
                </button>
              </div>

              {/* Editor Header */}
              <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4 border-b border-[#2a2a2a]">
                <p className="text-sm font-semibold text-gray-300">
                  Code Editor
                </p>

                <div className="flex items-center gap-2">
                  {tab === 1 ? (
                    <>
                      <button
                        className="w-[36px] h-[36px] rounded-lg border border-zinc-700 flex items-center justify-center text-gray-300 transition hover:bg-[#2a2a35] hover:text-white"
                        onClick={copyCode}
                      >
                        <IoCopy size={16} />
                      </button>

                      <button
                        className="w-[36px] h-[36px] rounded-lg border border-zinc-700 flex items-center justify-center text-gray-300 transition hover:bg-[#2a2a35] hover:text-white"
                        onClick={downloadFile}
                      >
                        <PiExportBold size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="w-[36px] h-[36px] rounded-lg border border-zinc-700 flex items-center justify-center text-gray-300 transition hover:bg-[#2a2a35] hover:text-white"
                        onClick={() => setIsNewTabOpen(true)}
                      >
                        <ImNewTab size={16} />
                      </button>

                      <button className="w-[36px] h-[36px] rounded-lg border border-zinc-700 flex items-center justify-center text-gray-300 transition hover:bg-[#2a2a35] hover:text-white">
                        <FiRefreshCcw size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Editor / Preview */}
              <div className="flex-1 overflow-hidden">
                {tab === 1 ? (
                  <Editor
                    height="100%"
                    language="html"
                    value={code}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      padding: { top: 10 },
                    }}
                  />
                ) : (
                  <iframe
                    srcDoc={code}
                    className="w-full h-full flex items-center justify-center bg-white text-black text-sm"
                  >
                    Preview will appear here
                  </iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isNewTabOpen === true ? (
        <>
          <div
            className="close absolute top-6 right-6 z-50 w-[45px] h-[45px] flex items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md cursor-pointer transition hover:bg-red-600"
            onClick={() => setIsNewTabOpen(false)}
          >
            <IoClose size={20} />
          </div>
          <iframe
            srcDoc={code}
            className="absolute inset-0 bg-white w-screen h-screen"
          ></iframe>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Home;
