import React from "react";
import { WORKBEM } from "./WorkWithDetails";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";

export interface TopFindings {
  topFinding: string;
  designDecision: string;
}

export interface WorkTableProps {
  header: string[];
  rows: TopFindings[];
}

export function createData(topFinding: string, designDecision: string) {
  return { topFinding, designDecision };
}

export interface WorkTableState {}

class WorkTable extends React.Component<WorkTableProps, WorkTableState> {
  render() {
    return (
      <div className={WORKBEM.element("table")}>
        <Table>
          <TableHead>
            <TableRow>
              {this.props.header.map((v, i) => (
                <TableCell key={i} variant="head">
                  {v.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.rows.map((row, i) => (
              <TableRow key={i} hover>
                <TableCell component="th" scope="row" variant="body">
                  {row.topFinding}
                </TableCell>
                <TableCell variant="body">
                  <b>{row.designDecision}</b>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default WorkTable;
