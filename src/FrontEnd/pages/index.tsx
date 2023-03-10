import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Center, Checkbox, CircularProgress, Container, Flex, FormControl, FormLabel, Grid, GridItem, Heading, IconButton, Input, Spacer, Stack, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { ChangeEvent, useEffect, useState } from 'react'
import { PatientDTO } from '../types/patients'
import { PatientCard } from '../components/PatientCard'
import { PageHead } from '../components/Head'
import { PageHeading } from '../components/PageHeading'

export default function Home() {

  const [loading, setLoading] = useState<boolean>(false);
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sort, setSort] = useState<string>('ascending');
  const [patientsBackup, setPatientsBackup] = useState<PatientDTO[]>();

  const toast = useToast();

  useEffect(() => {
    getPatients();
  }, [searchTerm, sort])

  const getPatients = async () => {
    setLoading(true);

    var resp = await fetch(`/api/patients/list?searchTerm=${searchTerm}&sort=${sort}`, {
      method: 'get'
    })
    if (!resp.ok) {
      var text = await resp.text();
      toast({
        title: 'Error',
        description: text,
        status: 'error'
      });
    }
    else {
      var json = await resp.json() as PatientDTO[];
      var formatted = json.map(j => {
        return patientDataCleanup(j);
      });
      setPatients(formatted);
      setPatientsBackup(formatted);
    }

    setLoading(false);
  }

  const patientDataCleanup = (p: PatientDTO): PatientDTO => {
    p["birthday"] = new Date(p.birthday).toISOString().substring(0, 10);
    return p;
  }

  const onSearchTextChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const onSortChanged = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSort('descending');
    }
    else {
      setSort('ascending');
    }
  }

  const onPatientSaveClicked = async (patient: PatientDTO) => {
    var resp = await fetch(`/api/patients/${patient.id}`, {
      method: 'put',
      body: JSON.stringify(patient)
    });

    if (!resp.ok) {
      var text = await resp.text();
      toast({ title: "Error", description: text, status: "error" });
      onPatientSaveUndoClicked(patient.id);
      return;
    }

    var json = await resp.json();
    var patientsCopy = patients.slice();
    var existingIndex = patientsCopy.findIndex(p => { return p.id == patient.id });
    if (existingIndex > -1) {
      patientsCopy[existingIndex] = patientDataCleanup(json);
      setPatients(patientsCopy);
    }

    setPatients(patientsCopy);
  }

  const onPatientSaveUndoClicked = (id: number) => {
    if (!patientsBackup) {
      return;
    }
    var original = patientsBackup.find(p => { return p.id == id });
    if (!original) {
      return;
    }
    var patientsCopy = patients.slice();
    for (var i = 0; i < patientsCopy.length; i++) {
      if (patientsCopy[i].id == id) {
        patientsCopy[i] = original
      }
    }

    setPatients(patientsCopy);
  }

  const onPatientChanged = (patient: PatientDTO) => {

    var patientsCopied = patients.slice();
    var existingIndex = patientsCopied.findIndex(p => p.id == patient.id);
    if (existingIndex < 0) {
      return;
    }

    console.log(patient);
    patientsCopied[existingIndex] = patient;
    setPatients(patientsCopied);
  }

  const patientMarkup = (patients || [])
    .map(p => {
      return (
        <Box w={"full"} key={p.id}>
          <PatientCard
            patient={p}
            onSaveClicked={() => onPatientSaveClicked(p)}
            onCancelEditClicked={() => onPatientSaveUndoClicked(p.id)}
            onChange={(patient) => { onPatientChanged(patient) }}
          />
        </Box>
      )
    })

  return (
    <>
      <PageHead
        title='Patient List'
      />
      <Stack id='stack' w={"full"}>
        <PageHeading heading="Patient List"/>
        <Box mb={5}>
          <FormControl>
            <FormLabel>Search</FormLabel>
            <Input type="text" onChange={e => onSearchTextChanged(e)}></Input>
          </FormControl>
          <FormControl>
            <FormLabel>Sort</FormLabel>
            <Checkbox onChange={(e) => onSortChanged(e)}>Descending</Checkbox>
          </FormControl>
        </Box>
        <Box>
          <>
            {!loading && (
              <>
                {patients.length==0 && (
                  <Box>
                    No patients found.
                  </Box>
                )}
                {patientMarkup}
              </>
            )}
            {loading && (
              <CircularProgress isIndeterminate />
            )}
          </>
        </Box>
      </Stack>
    </>
  )
}
