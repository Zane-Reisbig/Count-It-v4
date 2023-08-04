import type { NextPage } from 'next'
import Head from 'next/head'

import React, { Suspense } from 'react'
import { useState } from 'react'

import { GetFile } from '../components/getFile'
import HotReloader from '../components/hotReloadFileHandler'
// import { FileHandler } from '../components/fileHandler'

type fileRow = Array<Array<any>>;
interface HotReloaderProps {
  testObj: fileRow;
  localDBInstance: any;
}

const Home: NextPage = () => {
  const [fileOut, setFileOut] = useState<any>();


  return (
    <>
      <Head>
        <title>Count It! v4.0</title>
        <link rel="icon" href="favicon.ico" />
      </Head>
      <HotReloader testObj={[]} localDBInstance={undefined} />
    </>

  )
}

export default Home