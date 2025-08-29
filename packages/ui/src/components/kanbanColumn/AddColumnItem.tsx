import React, { useEffect, useRef, useState } from 'react';
import { Box, Group } from '@mantine/core';
import { TextField } from '../input';
import { Button } from '../button';

interface AddColumnItemProps {
  onSubmit: (value: string) => void;
}

export const AddColumnItem: React.FC<AddColumnItemProps> = ({ onSubmit }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleButtonClick = () => {
    setEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setValue('');
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setValue('');
    setEditing(false);
  };

  return (
    <Box w="100%" pos="sticky" bottom={0} bg="#fff" style={{ zIndex: 1 }}>
      {!editing ? (
        <Button
          type="button"
          fullWidth
          variant="white"
          onClick={handleButtonClick}
          leftSection={
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>+</span>
          }
        >
          Add item
        </Button>
      ) : (
        <Group gap={8} align="center">
          <TextField
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter item name"
            style={{ flex: 1 }}
          />
          <Button
            type="button"
            variant="filled"
            onClick={handleSubmit}
            aria-label="Add"
            size="xs"
          >
            +
          </Button>
          <Button
            type="button"
            variant="light"
            onClick={handleCancel}
            aria-label="Cancel"
            size="xs"
          >
            ×
          </Button>
        </Group>
      )}
    </Box>
  );
};
