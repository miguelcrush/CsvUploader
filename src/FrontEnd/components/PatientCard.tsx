import { Card, CardHeader, Heading } from '@chakra-ui/react';
import * as React from 'react';
import { PatientDTO } from '../types/patients';

type PatientCardProps = {
    patient: PatientDTO;
}

export const PatientCard = (props : PatientCardProps) =>{
    return (
        <Card size="sm" w={"full"}>
            <CardHeader>
                <Heading size="sm">{props.patient.lastName}, {props.patient.firstName}</Heading>
            </CardHeader>
        </Card>
    )
}