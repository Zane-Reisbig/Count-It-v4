import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'


import { GetFile } from './handlers/getFile/getFile'
import { FileHandler } from './handlers/handleFiles/fileHandler'

const Home: NextPage = () => {
  const [fileOut, setFileOut] = useState<File>(null);


  return (
    <>
      <Head>
        <title>Count It! v4.0</title>
      </Head>

      {fileOut ? <FileHandler fileOut={fileOut} fileOutHandler={setFileOut} /> : <GetFile fileOut={fileOut} fileOutHandler={setFileOut} />}
    </>

  )
}

export default Home