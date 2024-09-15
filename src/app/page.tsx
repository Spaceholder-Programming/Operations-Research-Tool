import Image from "next/image";

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="title">
          <main className="header_box">
            Operations Research Tool
            <br></br>
            <span className="header_copyright">
              <i>by Spaceholder Programming</i>
            </span>
          </main>
        </div>
      </header>
      <div className="grid grid-cols-2 grid-rows-1 p-6">
        <div className="body_box">
          <div className="body_title">
            Your optimization problem:
          </div>
          <button className="button">
            Maximize
          </button>
          <button className="button">
            Minimize
          </button>
          <br></br>
          <textarea
            className="textbox"
            placeholder="Function"
          />
          <div className="container">
            <br></br>
            <div className="text">s.t.</div>
            <textarea
              className="textbox"
              placeholder="Restriction"
            />
            <button className="button">
              remove
            </button>
          </div>

          <div className="container">
            <br></br>
            <div className="text">s.t.</div>
            <textarea
              className="textbox"
              placeholder="Restriction"
            />
            <button className="button">
              remove
            </button>
          </div>
          <div className="container">
            <br></br>
            <div className="text">s.t.</div>
            <textarea
              className="textbox"
              placeholder="Restriction"
            />
            <button className="button">
              remove
            </button>
          </div>

          <button className="button">
            add
          </button>
        </div>
        <div className="grid grid-cols-1 grod-rows-3">
          <div className="body_box">
            <div className="body_title">
              Result
            </div>
          </div>
          <div className="body_box">
            <div className="body_title">
              Variables
            </div>
          </div>
          <div className="body_box">
            <div className="body_title">
              Logs
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <footer className=" flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/Spaceholder-Programming/Operations-Research-Tool/wiki"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="https://nextjs.org/icons/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Go to our docs
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/Spaceholder-Programming/Operations-Research-Tool/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="https://nextjs.org/icons/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            See the source code
          </a>
        </footer>
      </div>
    </>
  );
}
