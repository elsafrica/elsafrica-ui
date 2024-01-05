'use client'
import React, { ChangeEvent, useContext, useState } from 'react';
import Header from '@/app/components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Notification } from '@/app/types/notification';
import { Context } from '@/app/providers/context';
import { useAuthenticate } from '@/app/helpers/useAuth';
import AxiosInstance  from '@/app/services/axios';
import Loader from '@/app/components/Loader';
import { Button, Card, IconButton, OutlinedInput } from '@mui/material';
import TextField from '../../components/TextField';
import { Form, Formik, FormikHelpers } from 'formik';
import Image from 'next/image';
import { Close, PlusOneOutlined } from '@mui/icons-material';
import Textarea from '../../components/TextArea';
import { array, number, object, string } from 'yup';
import moment from 'moment';
import { AxiosErrorData } from '@/app/types/data';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

const BASE_URL = process.env.REACT_APP_BASE_URL;

type Item = { id: number, name: string, quantity: number, unit_cost: number };

type FormikValues = {
  number: string,
  date: string,
  poNumber: string,
  dueDate: string,
  to: string,
  items: Item[],
  notes: string,
  terms: string,
  tax: number,
  discount: number,
  shipping: number
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'Ksh',
  minimumFractionDigits: 0,
});

export default function CustomerAccounts() {
  const [notification, setNotification] = useState<Notification>();

  const { authToken } = useContext(Context);
  const { isAuthenticated } = useAuthenticate(authToken);
  const axios = AxiosInstance.initInstance(authToken);

  const fetchCurrentInvoice = async () : Promise<{
    current: string,
	}> => {
    const data = (await axios.get(`${BASE_URL}/invoice/latest-invoice`)).data;
		
		return data;
	}

	const { data } = useQuery({
		queryKey: [ 'currentInvoice' ],
		queryFn: () => fetchCurrentInvoice(),
	});

  const handleNotificationClose = () => setNotification(undefined);

  if(!isAuthenticated) return <Loader />;

  const validator = object({
    number: string()
      .required('This field is required.'),
    date: string()
      .required('This field is required.')
      .test({
        name: 'date_test',
        test: (value: string = '') => moment(value, 'DD/MM/YY').isValid(),
        message: 'The value you have entered is not a valid Date'
      }),
    poNumber: string(),
    dueDate: string()
      .test({
        name: 'due_date_test',
        test: (value: string = '') => moment(value, 'DD/MM/YY').isValid(),
        message: 'The value you have entered is not a valid Date'
      }),
    to: string()
      .required('This field is required.'),
    items: array().min(1),
    notes: string(),
    terms: string(),
    tax: number(),
    discount: number(),
    shipping: number()
  })

  const onFieldChange = (item: Item, items: Item[], e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, inputType: number, setFieldValue: (fieldName: string, value: Item[]) => void) => {
    /**
     * Input type is as follows
     * 1: Name field
     * 2: Quantity field
     * 3: unit_cost field
     */

    switch (inputType) {
      case 1: {
        const newItems = items.filter((filterItem: Item) => filterItem.id !== item.id );
        item.name = e.target.value;
        newItems.push(item);
        const sorted = newItems.sort((a: Item, b: Item) => a.id - b.id);
        setFieldValue('items', sorted);
        return;
      }
      case 2: {
        const value = Number(e.target.value);

        if(Number.isNaN(value)) {
          return;
        }

        const newItems = items.filter((filterItem: Item) => filterItem.id !== item.id );
        item.quantity = value;
        newItems.push(item);
        const sorted = newItems.sort((a: Item, b: Item) => a.id - b.id);
        setFieldValue('items', sorted);
        return;
      }
      case 3: {
        const value = Number(e.target.value.split(' ')[1]);

        if(Number.isNaN(value)) {
          return;
        }

        const newItems = items.filter((filterItem: Item) => filterItem.id !== item.id );
        item.unit_cost = value;
        newItems.push(item);
        const sorted = newItems.sort((a: Item, b: Item) => a.id - b.id);
        setFieldValue('items', sorted);
        return;
      }
    }
  }

  const addItem = (setFieldValue: (fieldName: string, value: Item[]) => void, values: Item[]) => {
    const arrLen = values.length;
    const lastValue = values[arrLen - 1];
    const newValues = [...values, { id: lastValue?.id + 1 || 1, name: '', quantity: 0, unit_cost: 0 }];
    setFieldValue('items', newValues);
  }

  const removeItem = (setFieldValue: (fieldName: string, value: Item[]) => void, values: Item[], itemID: number) => {
    if(values.length < 1) {
      return;
    }

    const newValues = values.filter((item: Item) => item.id !== itemID);
    setFieldValue('items', newValues);
  }

  const onExtrasChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setFieldValue: (fieldName: string, value: number) => void, fieldName: string) => {
    const { value } = e.target;
    if(Number.isNaN(value)) return;

    setFieldValue(fieldName, Number(value));
  }

  const subTotal = (items: Item[]) => items.reduce((acc: number, next: Item) => acc + (next.quantity * next.unit_cost), 0);

  const grandTotal = (items: Item[], tax: number, shipping: number, discount: number) => {
    const subtotal = subTotal(items);
    const totalTax = subtotal * (tax / 100);

    return (subtotal + totalTax + shipping) - discount;
  }

  const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const res = await axios.post(`${BASE_URL}/invoice/create`, values, {
        responseType: 'blob'
      });
      const data = res.data; // or res.blob() if using blob responses      

      const url = window.URL.createObjectURL(
        new Blob([data], {
          type: 'application/pdf'
        })
      );

      const actualFileName = res.headers['Content-Disposition']?.match(/filename="?([^"]+)"?/)[1] || 'output.pdf';      

      // uses the download attribute on a temporary anchor to trigger the browser
      // download behavior. if you need wider compatibility, you can replace this
      // part with a library such as filesaver.js
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", actualFileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      } catch (error: any) {
      if (error.response) {
        return setNotification({
          status: 'error',
          message: error.response.data.err,
        });
      }

      setNotification({
        status: 'error',
        message: error.message,
      });
    }
  }
  
  return (
    <>
      <Header />
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        paddingRight='2rem'
      >
        <Typography
          sx={{
            color: '#91d000',
            fontWeight: 'bold',
            margin: '1.5rem 1rem 0.5rem',
          }}
          component='h1'
          textAlign='start'
        >
          Invoice
        </Typography>
      </Box>
          <Card sx={{ maxWidth: '85%', margin: '0 auto 2rem', padding: '1rem 0' }}>
            <Formik
              initialValues={{
                number: (Number(data?.current) + 1).toString().padStart(3, '0') || '001',
                date: '',
                poNumber: '',
                dueDate: '',
                to: '',
                items: [{
                  id: 0,
                  name: 'Hello world!',
                  quantity: 1,
                  unit_cost: 20
                }],
                notes: '',
                terms: '',
                tax: 0,
                discount: 0,
                shipping: 0
              }}
              validationSchema={validator}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {
                ({ values, setFieldValue }) => (
                  <Form>
                    <Box
                      display='flex'
                      width='100%'
                    >
                      <Box
                        flexBasis='60%'
                      >
                        <Image src='/img/logo_2.png' width={300} height={150} alt='Invoice logo' style={{ display: 'block' }}/>
                        <TextField
                          name='to'
                          label='Bill To'
                          size='small'
                          sx={{
                            margin: '5rem 2rem 0'
                          }}
                        />
                      </Box>
                      <Box
                        flexBasis='40%'
                        display='flex'
                        flexDirection='column'
                        alignItems='end'
                        paddingRight='2rem'
                      >
                        <Typography
                          component='h2'
                          fontSize='2rem'
                          textAlign='start'
                          width='65%'
                        >
                          Invoice
                        </Typography>
                        <TextField
                          name='number'
                          label='Invoice Number'
                          size='small'
                          sx={{
                            margin: '0.5rem 0',
                          }}
                        />
                        <TextField
                          name='date'
                          label='Date'
                          placeholder='DD/MM/YY'
                          size='small'
                          sx={{
                            margin: '0.5rem 0'
                          }}
                        />
                        <TextField
                          name='poNumber'
                          label='PO Number'
                          size='small'
                          sx={{
                            margin: '0.5rem 0'
                          }}
                        />
                        <TextField
                          name='dueDate'
                          label='Due Date'
                          placeholder='DD/MM/YY'
                          size='small'
                          sx={{
                            margin: '0.5rem 0'
                          }}
                        />
                      </Box>
                    </Box>
                    <Box
                      display='flex'
                      width='95%'
                      borderRadius='8px'
                      margin='1rem auto 0'
                      sx={{ backgroundColor: '#000' }}
                      padding='8px'
                    >
                      <Typography
                        component='span'
                        color='HighlightText'
                        fontSize='0.75rem'
                        flexBasis='59.5%'
                      >
                        Item
                      </Typography>
                      <Typography
                        component='span'
                        color='HighlightText'
                        fontSize='0.75rem'
                        flexBasis='13%'
                      >
                        Quantity
                      </Typography>
                      <Typography
                        component='span'
                        color='HighlightText'
                        fontSize='0.75rem'
                        flexBasis='13%'
                      >
                        Rate
                      </Typography>
                      <Typography
                        component='span'
                        color='HighlightText'
                        fontSize='0.75rem'
                        flexBasis='13%'
                      >
                        Amount
                      </Typography>
                    </Box>
                    
                    <Box
                      width='97%'
                      borderRadius='8px'
                      margin='0.5rem auto'
                    >
                      {
                        values.items.map((item: { id: number, name: string, quantity: number, unit_cost: number}) => (
                          <Box key={item.id} display='flex' alignItems='center' justifyContent='space-between' marginTop='0.5rem'>
                            <OutlinedInput size='small' sx={{ flexBasis: '58.5%', fontSize: '0.8rem' }} value={item.name} placeholder='Name' onChange={(e) => onFieldChange(item, values.items, e, 1, setFieldValue)}/>
                            <OutlinedInput size='small' sx={{ flexBasis: '11.5%', fontSize: '0.8rem' }} value={item.quantity} placeholder='Quantity' onChange={(e) => onFieldChange(item, values.items, e, 2, setFieldValue)}/>
                            <OutlinedInput size='small' sx={{ flexBasis: '11.5%', fontSize: '0.8rem' }} value={`KSH ${item.unit_cost}`} prefix='KSH' placeholder='unit_cost' onChange={(e) => onFieldChange(item, values.items, e, 3, setFieldValue)}/>
                            <Typography flexBasis='11.5%' component='span' fontSize='0.8rem'>{formatter.format(item.unit_cost * item.quantity)}</Typography>
                            <IconButton size='small' onClick={() => removeItem(setFieldValue, values.items, item.id)}><Close fontSize='small'/></IconButton>
                          </Box>
                        ))
                      }
                      <Button size='small' sx={{ margin: '0.75rem 0'}} startIcon={<PlusOneOutlined />} color='success' variant='contained' onClick={() => addItem(setFieldValue, values.items)}>Add Item</Button>
                    </Box>
                    <Box
                      width='97%'
                      borderRadius='8px'
                      margin='0.5rem auto'
                      display='flex'
                    >
                      <Box
                        flexBasis='60%'
                      >
                        <Textarea
                          style={{
                            maxWidth: '80%',
                            minWidth: '80%',
                            height: '50px',
                            minHeight: '50px',
                            padding: '1rem',
                            fontSize: '1rem',
                            clear: 'right',
                          }}
                          placeholder='Notes'
                          onChange={(value) => setFieldValue('notes', value)}
                        />
                        <Textarea
                          style={{
                            maxWidth: '80%',
                            minWidth: '80%',
                            height: '50px',
                            minHeight: '50px',
                            padding: '1rem',
                            fontSize: '1rem',
                            clear: 'right',
                            marginTop: '1rem'
                          }}
                          placeholder='Terms'
                          onChange={(value) => setFieldValue('terms', value)}
                        />
                      </Box>
                      <Box
                        flexBasis='40%'
                        display='flex'
                        flexDirection='column'
                        alignItems='end'
                        paddingRight='2rem'
                        gap='0.75rem'
                      >
                        <Box>
                          <Typography component='span' fontSize='0.8rem' marginRight='11rem'>Subtotal</Typography><Typography component='span' fontSize='0.8rem'>{formatter.format(subTotal(values.items))}</Typography>
                        </Box>
                        <Box>
                          <Typography component='span' fontSize='0.8rem'>Discount (KSH)</Typography>
                          <OutlinedInput size='small' sx={{ marginLeft: '2rem', fontSize: '0.8rem' }} value={values.discount} placeholder='Discount' onChange={(e) => onExtrasChange(e, setFieldValue, 'discount')}/>
                        </Box>
                        <Box>
                          <Typography component='span' fontSize='0.8rem'>Tax (%)</Typography>
                          <OutlinedInput size='small' sx={{ marginLeft: '2rem', fontSize: '0.8rem' }} value={values.tax} placeholder='Tax' onChange={(e) => onExtrasChange(e, setFieldValue, 'tax')}/>
                        </Box>
                        <Box>
                          <Typography component='span' fontSize='0.8rem'>Shipping (KSH)</Typography>
                          <OutlinedInput size='small' sx={{ marginLeft: '2rem', fontSize: '0.8rem' }} value={values.shipping} placeholder='Shipping' onChange={(e) => onExtrasChange(e, setFieldValue, 'shipping')}/>
                        </Box>
                        <Box>
                          <Typography component='span' fontSize='0.8rem' marginRight='9.5rem'>Grand Total</Typography><Typography component='span' fontSize='0.8rem'>{formatter.format(grandTotal(values.items, values.tax, values.shipping, values.discount))}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box display='flex' alignItems='end' width='97%' margin='1.5rem auto 0' justifyContent='end'>
                      <Button type='submit' variant='contained' color='info'>Generate Invoice</Button>
                    </Box>
                  </Form>
                )
              }
            </Formik>
          </Card>
      <Snackbar
        autoHideDuration={6000}
        open={Boolean(notification)}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert
          severity={notification?.status}
          sx={{
            width: '100%'
          }}
          onClose={handleNotificationClose}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </>
  );
}