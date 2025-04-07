
import { useIntl } from 'react-intl';
import getTrad from '../utils/getTrad';


export const useFormatMessage = () => {
    const { formatMessage } = useIntl();
    return (tradId: string, defaultMessage: string): string =>
      formatMessage({
        id: getTrad(tradId),
        defaultMessage,
      });
  };

