import { propNames } from '@chakra-ui/react';
import Head from 'next/head';
import * as React from 'react';

type PageHeadProps = {
    title?:string;
    description?: string;
}

export const PageHead = (props : PageHeadProps) => {
    return (
        <Head>
            <title>{props.title}</title>
            <meta name="description" content={props.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}