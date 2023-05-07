import { ChangeEvent, useEffect, useState } from 'react';

import GitHubIcon from '@mui/icons-material/GitHub';
import {
  AppBar,
  Box,
  FormControlLabel,
  Grid,
  InputLabel,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

import { chromeStorage } from '~/utils/chromeStorage';
import { chromeTabs } from '~/utils/chromeTabs';

import './App.css';

function App() {
  const [enabled, setEnabled] = useState(true);
  const [effectivePath, setEffectivePath] = useState('');

  useEffect(() => {
    (async () => {
      const data = await chromeStorage.fetch(['enabled', 'effectivePath']);

      if (typeof data.enabled !== 'undefined') setEnabled(data.enabled);
      if (typeof data.effectivePath !== 'undefined') setEffectivePath(data.effectivePath);
    })();
  }, [setEnabled, setEffectivePath]);

  const saveEnabled = (enabled: boolean) => {
    chromeStorage.save('enabled', enabled);

    chromeTabs.publish({
      action: 'sendEnabled',
      message: enabled,
    });
  };

  const saveEffectivePath = (effectivePath: string) => {
    chromeStorage.save('effectivePath', effectivePath);

    chromeTabs.publish({
      action: 'sendEffectivePath',
      message: effectivePath,
    });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              component="div"
              sx={{ flexGrow: 1 }}
              variant="h6"
            >
              esa save safeguard
            </Typography>

            <a
              href="https://github.com/your_username/your_repository"
              rel="noopener noreferrer"
              target="_blank"
            >
              <GitHubIcon sx={{ color: '#fff' }}></GitHubIcon>
            </a>
          </Toolbar>
        </AppBar>
      </Box>

      <Box
        sx={{
          px: 4,
          py: 2,
        }}
      >
        <Grid
          alignItems="start"
          container
          direction="column"
          justifyContent="start"
          rowGap={2}
        >
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={enabled}
                  size="small"
                />
              }
              label="機能の有効化"
              onChange={(event) => {
                // NOTE: 公式に則って下記のChangeEventを利用すると型エラーが起きるのでアサーション
                const checked = (event as ChangeEvent<HTMLInputElement>).target.checked;
                setEnabled(checked);
                saveEnabled(checked);
              }}
            />
          </Grid>

          <Grid
            columns={12}
            item
          >
            <InputLabel
              htmlFor="effective-path-input"
              shrink
            >
              機能を有効化するesaのパス
            </InputLabel>
            <TextField
              fullWidth
              id="effective-path-input"
              onChange={(event) => {
                const value = event.target.value;
                setEffectivePath(value);
                saveEffectivePath(value);
              }}
              placeholder="文頭に/を付けてください"
              size="small"
              sx={{ width: '100%' }}
              value={effectivePath}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
