import { useState, useEffect, useCallback } from 'react';

import { Page } from '../page';
import { Header } from '../header';
import { PromptSection } from '../prompt-section';
import { SearchResultSection } from '../search-result-section';
import { Footer } from '../footer';
import { Popup } from '../popup';
import { usePopup } from '../../hooks/usePopup';
import openAiApi from '../../utils/openAiApi';
import {
  clearSavedSearches,
  readSavedSearches,
  writeSavedSearches
} from './storage';

import { promptFormErrorMessages } from '../../shared/constants/prompt-form-error-messages';
import { DEFAULT_ERROR_MESSAGE } from '../../shared/constants/default-error-message';

export const App = () => {
  const [promptSubmitButtonText, setPromptSubmitButtonText]
    = useState('Submit');
  const [cards, setCards] = useState([]);
  const [popupSettings, { changePopupSettings, closePopup }] = usePopup();

  useEffect(() => {
    setCards(readSavedSearches());
  }, []);

  const handlePrompt = (data) => {
    const openAiRequest = data.prompt;

    setPromptSubmitButtonText('Thinking...');

    return openAiApi
      .sendPrompt(data)
      .then(({ data }) => {
        // Read the latest persisted list so concurrent responses do not
        // overwrite cards that resolved after this handler was created.
        const nextCards = [
          {
            id: data.id,
            prompt: openAiRequest,
            response: data.choices[0].text
          },
          ...readSavedSearches()
        ];

        writeSavedSearches(nextCards);
        setCards(nextCards);
      })
      .catch((err) => {
        switch (err) {
        case 400:
          changePopupSettings({
            message: promptFormErrorMessages.BAD_REQUEST
          });
          break;
        case 401:
          changePopupSettings({
            message: promptFormErrorMessages.UNAUTHORIZED
          });
          break;
        default:
          changePopupSettings({
            message: DEFAULT_ERROR_MESSAGE
          });
        }

        throw err;
      })
      .finally(() => {
        setPromptSubmitButtonText('Submit');
      });
  };

  const handleClearSearchResults = () => {
    changePopupSettings({
      isOpen: true,
      message: 'Are you sure you want to clear all prompts and responses?',
      action: 'Clear',
      onActionClick: handleConfirmClearSearchResults
    });
  };

  const handleConfirmClearSearchResults = () => {
    clearSavedSearches();
    setCards([]);
    closePopup();
  };

  const closeWithEsc = useCallback((e) => {
    if (e.key === 'Escape') {
      closePopup();
    }
  }, []);

  useEffect(() => {
    if (popupSettings.message) {
      changePopupSettings({ isOpen: true });
    }
  }, [popupSettings.message]);

  useEffect(() => {
    if (popupSettings.isOpen) {
      document.addEventListener('keydown', closeWithEsc);
    }
    return () => document.removeEventListener('keydown', closeWithEsc);
  }, [closeWithEsc, popupSettings.isOpen]);

  return (
    <>
      <Page>
        <Page.Header>
          <Header/>
        </Page.Header>
        <Page.Content>
          <PromptSection
            submitButtonText={promptSubmitButtonText}
            onPrompt={handlePrompt}
          />
          <SearchResultSection
            cards={cards}
            onClearSearchResults={handleClearSearchResults}
          />
        </Page.Content>
        <Page.Footer>
          <Footer/>
        </Page.Footer>
      </Page>
      <Popup
        isOpen={popupSettings.isOpen}
        message={popupSettings.message}
        onClose={closePopup}
        action={popupSettings.action}
        onActionClick={popupSettings.onActionClick}
      />
    </>
  );
};
