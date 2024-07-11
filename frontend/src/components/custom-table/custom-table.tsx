import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";

interface Column {
  header: string;
  render: (row: any) => JSX.Element | string;
}

interface Props {
  rows: any[];
  columns: Column[];
  actions?: {
    label: string;
    color: "primary" | "secondary";
    onClick: (row: any) => void;
  }[];
}

const CustomTable: React.FC<Props> = ({ rows, columns, actions }) => {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>{column.header}</TableCell>
            ))}
            {actions && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>{column.render(row)}</TableCell>
              ))}
              {actions && (
                <TableCell>
                  <div style={{ display: "flex" }}>
                    {actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        color={action.color}
                        size="small"
                        onClick={() => action.onClick(row)}
                        style={{ marginRight: 5 }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
