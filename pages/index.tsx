import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'


import { GetFile } from '../components/getFile'
import { FileHandler } from '../components/fileHandler'

const Home: NextPage = () => {
  const [fileOut, setFileOut] = useState<any>();


  return (
    <>
      <Head>
        <title>Count It! v4.0</title>
      </Head>

      {/* {fileOut ? <FileHandler fileOut={fileOut} fileOutHandler={setFileOut} /> : <GetFile fileOut={fileOut} fileOutHandler={setFileOut} />} */}
      {/* Typescript doesnt like the line above so we have to re-write it to be type safe */}

      {fileOut ? <FileHandler fileOut={fileOut} fileOutHandler={setFileOut} /> : <GetFile fileOut={fileOut} fileOutHandler={setFileOut} />}




    </>

  )
}

export default Home