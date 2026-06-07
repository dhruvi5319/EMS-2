import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { StatementRow } from './StatementRow';
import type { Statement } from '@/hooks/useStatements';

interface StatementTableProps {
  statements: Statement[];
  loading: boolean;
  canWaive: boolean;
  canDelete: boolean;
  onWaive: (statementId: string, justification: string) => Promise<void>;
  onDelete: (statementId: string) => Promise<void>;
}

export function StatementTable({
  statements,
  loading,
  canWaive,
  canDelete,
  onWaive,
  onDelete,
}: StatementTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Statement</TableHead>
            <TableHead className="w-28">Evidence</TableHead>
            <TableHead className="w-36">Assigned</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-28">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statements.map((statement, index) => (
            <StatementRow
              key={statement.id}
              statement={statement}
              sequenceNumber={statement.display_order || index + 1}
              canWaive={canWaive}
              canDelete={canDelete}
              onWaive={onWaive}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
