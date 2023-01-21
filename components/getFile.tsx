import type { NextPage } from 'next'
import { useRouter } from 'next/router'


interface GetFileProps {
  fileOut: File;
  fileOutHandler: (file: File) => void;
}

export const GetFile: NextPage<GetFileProps> = (props) => {
  props.fileOut ? props.fileOut : null;

  function listFiles(files: FileList, sender: any = null) {
    sender ? sender.preventDefault() : null;

    const fileLabelHandle = document.getElementById('fileLabel') as HTMLLabelElement;
    const continueButtonHandle = document.getElementById('continueButton') as HTMLButtonElement;
    fileLabelHandle.innerText = "Click Me!\n";

    let varFilename = files[0] ? files[0].name : "No File Selected";
    varFilename = varFilename.length > 20 ? varFilename.slice(0, 20) + "..." : varFilename;
    fileLabelHandle.innerText += varFilename

    props.fileOutHandler(files[0]);

    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          continueButtonHandle.style.opacity = (i / 10).toString();
        }, i * 50);
      }
      continueButtonHandle.style.pointerEvents = "all";
    }, 1000);
  }

  function pageDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }

  return (
    <div className="">
      <main className="" onDragOver={(e) => pageDragOver(e)}>
        <div
          className={`
            filePromptContainer
            grid
            grid-cols-3
            grid-rows-4
            grid-flow-row
          `}>

          <h1
            className={`
              fileSelectPromptAndButton
              col-span-3
              text-white
              text-5xl
              text-center
              font-bold
              m-2
            `}>
            Select a file to continue...<br />
            <span className={`text-2xl m-0 p-0`}>or drop it here 👇</span>
          </h1>

          <div />

          <div
            onDrop={(e) => listFiles(e.dataTransfer.files, e)}
            onDragOver={(e) => e.preventDefault()}
            onClick={(e) => document.getElementById('fileLabel')!.click()}
            className={`
              fileSelectButtonContainer
              
              p-10
              border-2
              border-black
              bg-white
              rounded-lg
              text-center
              cursor-pointer
              
              transition-all
              duration-300
              ease-in-out

              hover:bg-zinc-50

              active:bg-zinc-100
              active:scale-95
            `}>
            <label htmlFor="file" id="fileLabel"
              className={`font-bold text-black`}>
              Click Me!</label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) =>
                listFiles(e.target.files!, e)
              }
            />
          </div>

          {/* Styling Divs */}
          {/* Because of the CSS Grid System */}
          <div />
          <div />
          <div />
          <div />
          <div />
          {/* Lmao */}


          <button
            onClick={() => {
              const router = useRouter();
              router.push('/');
            }}
            style={{ opacity: 0, pointerEvents: "none" }}
            className={` 
              fileSelectButtonContainer
              
              p-10
              border-2
              border-black
              bg-white
              rounded-lg
              text-center
              text-black
              font-bold
              cursor-pointer
              
              transition-all
              duration-300
              ease-in-out

              hover:bg-zinc-50

              active:bg-zinc-100
              active:scale-95
            `}
            id="continueButton"
          >Continue</button>
        </div>
      </main>
    </div>
  )
}