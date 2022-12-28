import { Heading } from '@chakra-ui/react';
import * as React from 'react';

type PageHeadingProps = {
    heading:string;
}

export const PageHeading = (props:PageHeadingProps)=>{
    return (
    <Heading size="sm" id='heading'>
        {props.heading}
    </Heading>
    )
}