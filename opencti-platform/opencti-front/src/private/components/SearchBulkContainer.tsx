import React, { ChangeEvent, useEffect, useMemo, useState, CSSProperties } from 'react';
import { isEmpty } from 'ramda';
import { useSearchParams } from 'react-router-dom';
import SearchBulkUnknownEntities from './SearchBulkUnknownEntities';
import { useFormatter } from '../../components/i18n';
import useConnectedDocumentModifier from '../../utils/hooks/useConnectedDocumentModifier';
import SearchBulk from './SearchBulk';
import { DataTableProps } from '../../components/dataGrid/dataTableTypes';
import useDebounceCallback from '../../utils/hooks/useDebounceCallback';
import { splitIntoLines } from '../../utils/String';
import { Search as SearchIcon } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';

const SearchBulkContainer = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  const [searchParams, setSearchParams] = useSearchParams();

  setTitle(t_i18n('Bulk Search'));

  const [textFieldValue, setTextFieldValue] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [values, setValues] = useState<string[]>([]);
  const [numberOfUnknownEntities, setNumberOfUnknownEntities] = useState(0);
  const [numberOfKnownEntities, setNumberOfKnownEntities] = useState(0);

  const setValuesAfterDebounce = useDebounceCallback(setValues, 500);

  const bulkTextToValues = (text: string) => {
    return text
      .split('\n')
      .filter((o) => o.length > 1)
      .map((val) => val.trim());
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      const text = splitIntoLines(q);
      setTextFieldValue(text);
      setValues(bulkTextToValues(text));
      searchParams.delete('q');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const handleChangeTab = (value: number) => {
    setCurrentTab(value);
  };

  const handleChangeTextField = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    const text = splitIntoLines(value);
    setTextFieldValue(text);
    setValuesAfterDebounce(bulkTextToValues(text));
  };

  const dataColumns = useMemo<DataTableProps['dataColumns']>(() => ({
    entity_type: {
      isSortable: true,
    },
    value: {
      isSortable: false,
    },
    createdBy: {},
    creator: {},
    objectLabel: {},
    created_at: {
      percentWidth: 14,
    },
    analyses: {
      percentWidth: 7,
    },
    objectMarking: {},
  }), []);

  const keywordCount = values.length;

  const tabs = [
    { label: t_i18n('Known entities'), count: numberOfKnownEntities },
    { label: t_i18n('Unknown entities'), count: numberOfUnknownEntities },
  ];

  return (
    <>
      <Breadcrumbs elements={[{ label: t_i18n('Search') }, { label: t_i18n('Bulk search'), current: true }]} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        padding: '24px 24px 0 24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '4px',
        }}>
          <h1 className="ravin-lowercase-voice" style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--ravin-text)',
            lineHeight: 1.3,
          }}>
            {t_i18n('Bulk search')}
          </h1>
          <span style={{
            fontSize: '13px',
            color: 'var(--ravin-text-muted)',
          }}>
            {t_i18n('Search multiple IOCs or keywords across the knowledge base')}
          </span>
        </div>

        <div className="ravin-bulk-layout" style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          gap: '16px',
          marginTop: '16px',
        }}>
        <div className="ravin-bulk-input-panel" style={{
          width: '300px',
          flexShrink: 0,
          backgroundColor: 'var(--ravin-surface)',
          borderRadius: '4px',
          border: '1px solid var(--ravin-border)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          <div style={{
            padding: '12px 16px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span className="ravin-lowercase-voice" style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--ravin-text-muted)',
              letterSpacing: '0.02em',
            }}>
              {t_i18n('Keywords')}
            </span>
            {keywordCount > 0 && (
              <span className="ravin-lowercase-voice" style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--ravin-text-light)',
                backgroundColor: 'var(--ravin-surface-2)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>
                {keywordCount} {keywordCount === 1 ? t_i18n('item') : t_i18n('items')}
              </span>
            )}
          </div>
          <textarea
            className="ravin-bulk-textarea"
            onChange={handleChangeTextField}
            value={textFieldValue}
            placeholder={t_i18n('One keyword by line or separated by commas')}
            spellCheck={false}
            style={{
              flex: 1,
              minHeight: 0,
              margin: '0 12px 12px',
              padding: '12px',
              backgroundColor: 'var(--ravin-elevated)',
              border: '1px solid var(--ravin-border)',
              borderRadius: '4px',
              color: 'var(--ravin-text)',
              fontSize: '13px',
              fontFamily: 'Consolas, monaco, monospace',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              transition: 'border-color 150ms ease',
            } as CSSProperties}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--ravin-primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--ravin-border)';
            }}
          />
        </div>

        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          <div style={{
            display: 'flex',
            gap: '0',
            borderBottom: '1px solid var(--ravin-border)',
            marginBottom: '0',
          }}>
            {tabs.map((tab, index) => {
              const isActive = currentTab === index;
              return (
                <button
                  key={tab.label}
                  onClick={() => handleChangeTab(index)}
                  className="ravin-lowercase-voice"
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--ravin-primary)' : '2px solid transparent',
                    color: isActive ? 'var(--ravin-text)' : 'var(--ravin-text-muted)',
                    fontSize: '13px',
                    fontWeight: isActive ? 500 : 400,
                    padding: '10px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'color 150ms ease, border-color 150ms ease',
                  } as CSSProperties}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--ravin-text)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--ravin-text-muted)';
                  }}
                >
                  {tab.label}
                  <span style={{
                    fontSize: '11px',
                    color: isActive ? 'var(--ravin-primary)' : 'var(--ravin-text-light)',
                    backgroundColor: 'var(--ravin-surface-2)',
                    padding: '1px 7px',
                    borderRadius: '4px',
                    fontWeight: 500,
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
          }}>
            {currentTab === 0 && (
              <div style={{ display: values.length > 0 ? 'block' : 'none' }}>
                <SearchBulk
                  inputValues={values}
                  dataColumns={dataColumns}
                  setNumberOfEntities={setNumberOfKnownEntities}
                />
              </div>
            )}
            {currentTab === 0 && values.length === 0 && isEmpty(textFieldValue) && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '300px',
                gap: '12px',
                color: 'var(--ravin-text-light)',
              }}>
                <SearchIcon size={28} strokeWidth={1.5} />
                <span className="ravin-lowercase-voice" style={{
                  fontSize: '14px',
                }}>
                  {t_i18n('Enter keywords to begin search')}
                </span>
              </div>
            )}
            {currentTab === 0 && values.length === 0 && !isEmpty(textFieldValue) && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '300px',
                gap: '12px',
                color: 'var(--ravin-text-light)',
              }}>
                <SearchIcon size={28} strokeWidth={1.5} />
                <span className="ravin-lowercase-voice" style={{
                  fontSize: '14px',
                }}>
                  {t_i18n('Each keyword must be at least 2 characters')}
                </span>
              </div>
            )}
            <SearchBulkUnknownEntities
              values={values}
              setNumberOfEntities={setNumberOfUnknownEntities}
              isDisplayed={currentTab === 1}
            />
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBulkContainer;
