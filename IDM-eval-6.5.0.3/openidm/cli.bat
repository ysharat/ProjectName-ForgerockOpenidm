@echo off
SETLOCAL

:: Set the OpenIDM Environment Variables
call %~dp0\bin\idmenv.bat %*
if %ERRORLEVEL% == 0 goto noError
echo Failed to configure OpenIDM environment, aborting
goto end

:noError
::Set the OpenIDM Main class to be executed
set MAINCLASS=org.forgerock.openidm.shell.impl.Main

:: Execute Java with the applicable properties
pushd %OPENIDM_HOME%

java %LOGGING_CONFIG% -classpath "%OPENIDM_HOME%\bin\*;%OPENIDM_HOME%\bundle\*" -Didm.envconfig.dirs="%OPENIDM_HOME%/resolver/" %MAINCLASS% %*
popd

:end
ENDLOCAL
exit /b 1