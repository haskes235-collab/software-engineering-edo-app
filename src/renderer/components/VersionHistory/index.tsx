import { useLocalObservable } from 'mobx-react-lite';
import { DocumentVersion } from '@shared/types';
import { VersionHistoryController } from './VersionHistory.controller';
import { VersionHistoryView } from './VersionHistory.view';

interface VersionHistoryProps {
  versions: readonly DocumentVersion[];
  onVersionClick: (version: DocumentVersion) => void;
}

export function VersionHistory({ versions, onVersionClick }: VersionHistoryProps) {
  const controller = useLocalObservable(() => new VersionHistoryController());
  controller.setVersions(versions);

  return <VersionHistoryView controller={controller} onVersionClick={onVersionClick} />;
}
