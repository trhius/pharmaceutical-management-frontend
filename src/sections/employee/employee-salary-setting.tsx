import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
//-------------------------------------------------------
type NormalSalaryConfig = {
  shift: string;
  salaryPerShift: number;
  saturday: boolean;
  sunday: boolean;
  dayOff: number;
  holiday: number;
};

type OvertimeSalaryConfig = {
  normalDay: number;
  saturday: number;
  sunday: number;
  dayOff: number;
  holiday: number;
};

type CompensateConfig = {
  netRevenue: number;
  compensate: number;
};
type CommissionConfig = {
  netRevenue: number;
  commission: number;
};
type AllowanceConfig = {
  name: string;
  type: string;
  allowance: number;
};
type DeductionConfig = {
  name: string;
  type: string;
  amount: number;
};

const normalSalaryConfig = {
  shift: 'Default',
  salaryPerShift: 0,
  saturday: true,
  sunday: true,
  dayOff: 100,
  holiday: 100,
};

const defaultOvertimeSalaryConfig = {
  normalDay: 150,
  saturday: 200,
  sunday: 200,
  dayOff: 200,
  holiday: 300,
};

const compensateConfig = {
  netRevenue: 0,
  compensate: 0,
};
const commissionConfig = {
  netRevenue: 0,
  commission: 0,
};

const allowanceConfig = {
  name: '',
  type: '',
  allowance: 0,
};

const deductionConfig = {
  name: '',
  type: '',
  amount: 0,
};

export function EmployeeSalarySetting() {
  const [state, setState] = useState({ salaryType: '' });

  const [salaryConfigOpen, setSalaryConfigOpen] = useState(false);
  const [overtimeConfigOpen, setOvertimeConfigOpen] = useState(false);
  const [compensateConfigOpen, setCompensateConfigOpen] = useState(false);
  const [commissionConfigOpen, setCommissionConfigOpen] = useState(false);
  const [allowanceConfigOpen, setAllowanceConfigOpen] = useState(false);
  const [deductionConfigOpen, setDeductionConfigOpen] = useState(false);

  const [normalSalaryConfigs, setNormalSalaryConfigs] = useState<NormalSalaryConfig[]>([
    normalSalaryConfig,
  ]);
  const [overtimeSalaryConfig, setOvertimeSalaryConfig] = useState<OvertimeSalaryConfig>(
    defaultOvertimeSalaryConfig
  );
  const [compensateConfigs, setCompensateConfigs] = useState<CompensateConfig[]>([
    compensateConfig,
  ]);
  const [commissionConfigs, setCommissionConfigs] = useState<CommissionConfig[]>([
    commissionConfig,
  ]);
  const [allowanceConfigs, setAllowanceConfigs] = useState<AllowanceConfig[]>([allowanceConfig]);
  const [deductionConfigs, setDeductionConfigs] = useState<DeductionConfig[]>([deductionConfig]);

  const handleAddSalaryConfig = () => {
    setNormalSalaryConfigs([...normalSalaryConfigs, normalSalaryConfig]);
  };

  const handleRemoveSalaryConfig = (index: number) => {
    const newConfigs = [...normalSalaryConfigs];
    newConfigs.splice(index, 1);
    setNormalSalaryConfigs(newConfigs);
  };

  const handleAddCompensateConfig = () => {
    setCompensateConfigs([...compensateConfigs, compensateConfig]);
  };

  const handleRemoveCompensateConfig = (index: number) => {
    const newConfigs = [...compensateConfigs];
    newConfigs.splice(index, 1);
    setCompensateConfigs(newConfigs);
  };

  const handleAddCommissionConfig = () => {
    setCommissionConfigs([...commissionConfigs, commissionConfig]);
  };

  const handleRemoveCommissionConfig = (index: number) => {
    const newConfigs = [...commissionConfigs];
    newConfigs.splice(index, 1);
    setCommissionConfigs(newConfigs);
  };

  const handleAddAllowanceConfig = () => {
    setAllowanceConfigs([...allowanceConfigs, allowanceConfig]);
  };

  const handleRemoveAllowanceConfig = (index: number) => {
    const newConfigs = [...allowanceConfigs];
    newConfigs.splice(index, 1);
    setAllowanceConfigs(newConfigs);
  };

  const handleAddDeductionConfig = () => {
    setDeductionConfigs([...deductionConfigs, deductionConfig]);
  };

  const handleRemoveDeductionConfig = (index: number) => {
    const newConfigs = [...deductionConfigs];
    newConfigs.splice(index, 1);
    setDeductionConfigs(newConfigs);
  };

  return (
    <Box sx={{}}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Main Salary
        </Typography>
        <Grid container spacing={3}>
          <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Divider />
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 6 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid size={{ xs: 3, sm: 3, md: 3 }}>
                  <Typography variant="body2" sx={{}}>
                    Salary type
                  </Typography>
                </Grid>
                <Grid size={{ xs: 9, sm: 9, md: 9 }}>
                  <Autocomplete
                    options={['By working shift', 'By hour']}
                    value={state.salaryType}
                    onChange={(event, newValue) =>
                      setState({ ...state, salaryType: newValue || '' })
                    }
                    renderInput={(params) => <TextField {...params} variant="standard" />}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Divider />
            </Grid>
          </Grid>
          <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 12, md: 12 }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2" sx={{}}>
                Salary
              </Typography>
              <Switch
                checked={salaryConfigOpen}
                onChange={(e, checked) => setSalaryConfigOpen(checked)}
              />
            </Box>
            {salaryConfigOpen && (
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Shift</TableCell>
                      <TableCell>Salary/Shift</TableCell>
                      <TableCell>Saturday</TableCell>
                      <TableCell>Sunday</TableCell>
                      <TableCell>Day off</TableCell>
                      <TableCell>Holiday</TableCell>
                      <TableCell width="10px" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {normalSalaryConfigs.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <TextField type="text" defaultValue={row.shift} />
                        </TableCell>
                        <TableCell>
                          <TextField type="number" defaultValue={row.salaryPerShift} />
                        </TableCell>
                        <TableCell>
                          <Switch checked={row.saturday} />
                        </TableCell>
                        <TableCell>
                          <Switch checked={row.sunday} />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.dayOff}
                            slotProps={{
                              input: {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.holiday}
                            slotProps={{
                              input: {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell width="10px">
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleRemoveSalaryConfig(index)}>
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outlined" color="inherit" onClick={handleAddSalaryConfig}>
                  Add new line
                </Button>
              </TableContainer>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Divider />
          </Grid>
          <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 12, md: 12 }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2" sx={{}}>
                Overtime salary
              </Typography>
              <Switch
                checked={overtimeConfigOpen}
                onChange={(e, checked) => setOvertimeConfigOpen(checked)}
              />
            </Box>
            {overtimeConfigOpen && (
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Shift</TableCell>
                      <TableCell>Salary/Shift</TableCell>
                      <TableCell>Saturday</TableCell>
                      <TableCell>Sunday</TableCell>
                      <TableCell>Day off</TableCell>
                      <TableCell>Holiday</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[overtimeSalaryConfig].map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          Hourly wage coefficient
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.normalDay}
                            slotProps={{
                              input: {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.saturday}
                            slotProps={{
                              input: {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.sunday}
                            slotProps={{
                              input: {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.dayOff}
                            slotProps={{
                              input: {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.holiday}
                            slotProps={{
                              input: {
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Typography variant="subtitle1">Salary Form</Typography>
            <Autocomplete
              options={['Select available salary form']}
              value={state.salaryType}
              onChange={(event, newValue) => setState({ ...state, salaryType: newValue || '' })}
              renderInput={(params) => <TextField {...params} variant="standard" />}
            />
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack
          direction="row"
          gap={3}
          alignItems="center"
          width="100%"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1">Compensate</Typography>
          <Switch
            checked={compensateConfigOpen}
            onChange={(e, checked) => setCompensateConfigOpen(checked)}
          />
        </Stack>
        {compensateConfigOpen && (
          <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid container size={{ xs: 12, sm: 12, md: 12 }}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Autocomplete
                  options={['Personal revenue']}
                  value={state.salaryType}
                  onChange={(event, newValue) => setState({ ...state, salaryType: newValue || '' })}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Compensate type" />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Autocomplete
                  options={['Total revenue']}
                  value={state.salaryType}
                  onChange={(event, newValue) => setState({ ...state, salaryType: newValue || '' })}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Form" />
                  )}
                />
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Net revenue</TableCell>
                      <TableCell>Compensate</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {compensateConfigs.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          Sale consulting
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.netRevenue}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">From</InputAdornment>
                                ),
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.compensate}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position="end">% Revenue</InputAdornment>
                                ),
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell width="10px">
                          <Tooltip title="Delete">
                            <IconButton  onClick={() => handleRemoveCompensateConfig(index)}>
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outlined" color="inherit" onClick={handleAddCompensateConfig}>
                  Add new line
                </Button>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </Card>
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack
          direction="row"
          gap={3}
          alignItems="center"
          width="100%"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1">Commission</Typography>
          <Switch
            checked={commissionConfigOpen}
            onChange={(e, checked) => setCommissionConfigOpen(checked)}
          />
        </Stack>
        {commissionConfigOpen && (
          <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Net revenue</TableCell>
                      <TableCell>Beneficiary Commission</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commissionConfigs.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          Sale consulting
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            defaultValue={row.netRevenue}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">From</InputAdornment>
                                ),
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            options={['Option 1', 'Option 2']}
                            // value={row.commission}
                            // onChange={(event, newValue) =>
                            //   setState({ ...state, salaryType: newValue || '' })
                            // }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                              
                                variant="standard"
                                placeholder="Select commission table"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell width="10px">
                          <Tooltip title="Delete">
                            <IconButton  onClick={() => handleRemoveCommissionConfig(index)}>
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outlined" color="inherit" onClick={handleAddCommissionConfig}>
                  Add new line
                </Button>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </Card>
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack
          direction="row"
          gap={3}
          alignItems="center"
          width="100%"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1">Allowance</Typography>
          <Switch
            checked={allowanceConfigOpen}
            onChange={(e, checked) => setAllowanceConfigOpen(checked)}
          />
        </Stack>
        {allowanceConfigOpen && (
          <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Beneficiary allowance</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allowanceConfigs.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" width="100px">
                          <Autocomplete
                            options={['Option 1']}
                            value={row.name}
                            // onChange={(event, newValue) =>
                            //   setState({ ...state, salaryType: newValue || '' })
                            // }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                              
                                variant="standard"
                                placeholder="Select allowance type"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell width="100px">
                          <Autocomplete
                            options={['Option 1', 'Option 2']}
                            defaultValue="Option 1"
                            value={row.type}
                            // onChange={(event, newValue) =>
                            //   setState({ ...state, salaryType: newValue || '' })
                            // }
                            renderInput={(params) => (
                              <TextField {...params} variant="standard" />
                            )}
                          />
                        </TableCell>
                        <TableCell width="100px">
                          <TextField type="number" defaultValue={row.allowance} />
                        </TableCell>
                        <TableCell width="10px" align="right">
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleRemoveAllowanceConfig(index)}>
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outlined" color="inherit" onClick={handleAddAllowanceConfig}>
                  Add new line
                </Button>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </Card>
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack
          direction="row"
          gap={3}
          alignItems="center"
          width="100%"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1">Deduction</Typography>
          <Switch
            checked={deductionConfigOpen}
            onChange={(e, checked) => setDeductionConfigOpen(checked)}
          />
        </Stack>
        {deductionConfigOpen && (
          <Grid container spacing={3} columnSpacing={10} size={{ xs: 12, sm: 12, md: 12 }}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deductionConfigs.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" width="100px">
                          <Autocomplete
                            options={['Option 1']}
                            value={row.name}
                            // onChange={(event, newValue) =>
                            //   setState({ ...state, salaryType: newValue || '' })
                            // }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                              
                                variant="standard"
                                placeholder="Select allowance type"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell width="100px">
                          <Autocomplete
                            options={['Option 1', 'Option 2']}
                            value={row.type}
                            // onChange={(event, newValue) =>
                            //   setState({ ...state, salaryType: newValue || '' })
                            // }
                            renderInput={(params) => (
                              <TextField {...params} variant="standard" />
                            )}
                          />
                        </TableCell>
                        <TableCell width="100px">
                          <TextField type="number" defaultValue={row.amount} />
                        </TableCell>
                        <TableCell width="10px" align="right">
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleRemoveDeductionConfig(index)} >
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outlined" color="inherit" onClick={handleAddDeductionConfig}>
                  Add new line
                </Button>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </Card>
    </Box>
  );
}
