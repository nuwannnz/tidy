import { CoreProviders } from '../../providers/CoreProviders';
import { render } from '@testing-library/react';

export function renderComponent(components: React.ReactElement) {
  return render(<CoreProviders>{components}</CoreProviders>);
}
