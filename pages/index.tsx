import type { NextPage } from 'next'
import Head from 'next/head'

import React from 'react'
import { useState } from 'react'

import { GetFile } from '../components/getFile'
import { FileHandler } from '../components/fileHandler'

const Home: NextPage = () => {
  const [fileOut, setFileOut] = useState<any>();


  return (
    <>
      <Head>
        <title>Count It! v4.0</title>
        <link rel="icon" href="favicon.ico" />
      </Head>
      {fileOut ?
        <FileHandler fileOut={fileOut} fileOutHandler={setFileOut} />
        :
        <GetFile fileOut={fileOut} fileOutHandler={setFileOut} />
      }

    </>

  )
}

export default Home