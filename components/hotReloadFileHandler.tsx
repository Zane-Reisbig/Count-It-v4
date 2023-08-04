import { NextPage, NextPageContext } from 'next';
import { useState, useEffect } from 'react';
import React from 'react';
import styles from './handleFiles.module.css';
import testObj from './excelFileStructure.js';
import initDataBase from '../pages/api/DBInit';

type fileRow = Array<Array<any>>;

interface HeaderObject {
    [key: string]: string | number;
    arrayPosition: number;
}

interface HotReloaderProps {
    testObj: fileRow;
    localDBInstance: any;
}

const HotReloader: NextPage<HotReloaderProps> = (props) => {
    const [loading, setLoading] = useState(true);
    const [localDBData, setLocalDBData] = useState(null);

    useEffect(() => {
        // Asynchronously fetch the data and set the state when it's ready
        async function fetchData() {
            const response = await fetch('/api/DBInit');
            const data = await response.json();
            setLocalDBData(data);
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Hot Reloader</h1>
            {/* Display the data when it's available */}
            <pre>{JSON.stringify(localDBData, null, 2)}</pre>
        </div>
    );
};

HotReloader.getInitialProps = async () => {
    return {
        testObj,
        localDBInstance: await (await fetch('/api/DBInit')).json(),
    };
};

export default HotReloader;
