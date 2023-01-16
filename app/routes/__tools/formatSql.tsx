import React from 'react';
import { TextField, Grid, Button } from '@mui/material';
import type { ActionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { badRequest } from '~/utils/request.server';
import { format } from 'sql-formatter';

export const action = async ({ request }: ActionArgs) => {
  const queryString = await request.text();
  const searchParams = new URLSearchParams(queryString);
  const body: any = {};
  const entries = Array.from(searchParams.entries());
  entries.forEach(([key, value]) => {
    body[key] = value;
  });

  const str = body['content'];

  let formatted = ""
  try {
    formatted = format(str,
      {
        language: 'sql',
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 2
      })
  }
  catch (ex) {
    console.error(ex)
    return badRequest(`Error formatting sql query: ${ex}`)
  }

  return formatted;
};

export default function FormatSql() {
  const actionData = useActionData<typeof action>();

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
            Place a semicolon <code>;</code> after each SQL statement to put new lines between statements
        </Grid>
        <Grid item xs={12}>
          <Form method="post">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="content"
                  fullWidth
                  id="content"
                  multiline
                  rows={10}
                  placeholder="Enter SQL to format"
                />
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant="contained" name="format" type="submit" value="Format">
                      Format
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </Grid>
        {actionData != undefined && (
          <Grid item xs={12}>
            <TextField fullWidth id="content-result" multiline rows={10} value={actionData} />
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
}

export function ErrorBoundary() {
  return <div className="error-container">Something unexpected went wrong. Sorry about that.</div>;
}
