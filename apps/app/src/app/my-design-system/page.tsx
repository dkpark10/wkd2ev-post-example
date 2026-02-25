'use client';

import { useEffect, useState } from 'react';
import Button from '@atlaskit/button/new';
import MyButton from '@/components/button';
import ThemeToggle from '@/components/theme-toggle';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onClick = () => { };

  if (!mounted) return null;

  return (
    <>
      <ThemeToggle />

      <div>atlassian button</div>
      <Button appearance="default" onClick={onClick}>default</Button>
      <Button appearance="danger" onClick={onClick}>danger</Button>
      <Button appearance="discovery" onClick={onClick}>discovery</Button>
      <Button appearance="primary" onClick={onClick}>primary</Button>
      <Button appearance="warning" onClick={onClick}>warning</Button>
      <Button appearance="warning" onClick={onClick}>warning</Button>
      <Button appearance="subtle" onClick={onClick}>subtle</Button>

      <div>my button</div>
      <MyButton appearance="default" onClick={onClick}>default</MyButton>
      <MyButton appearance="danger" onClick={onClick}>danger</MyButton>
      <MyButton appearance="discovery" onClick={onClick}>discovery</MyButton>
      <MyButton appearance="primary" onClick={onClick}>primary</MyButton>
      <MyButton appearance="warning" onClick={onClick}>warning</MyButton>
      <MyButton appearance="subtle" onClick={onClick}>subtle</MyButton>

      <div>atlassian state button</div>
      <Button appearance="primary" onClick={onClick}>primary</Button>
      <Button appearance="primary" isDisabled onClick={onClick}>primary</Button>
      <Button appearance="primary" isSelected onClick={onClick}>primary</Button>
      <Button appearance="primary" isLoading onClick={onClick}>primary</Button>
      <Button appearance="primary" spacing='compact' onClick={onClick}>primary</Button>

      <div>my state button</div>
      <MyButton appearance="primary" onClick={onClick}>primary</MyButton>
      <MyButton appearance="primary" isDisabled onClick={onClick}>primary</MyButton>
      <MyButton appearance="primary" isSelected onClick={onClick}>primary</MyButton>
      <MyButton appearance="primary" isLoading onClick={onClick}>primary</MyButton>
      <MyButton appearance="primary" spacing='compact' onClick={onClick}>primary</MyButton>
    </>
  );
};
