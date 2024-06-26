import platform
import re
import subprocess


def ping_website(url: str, num_of_pings: int = 1):
    """ping website and return latency in ms"""

    cmd = ['ping', url]
    if platform.system() == 'Linux':
        cmd = ['ping', '-c', str(num_of_pings), url]

    process = subprocess.Popen(cmd,
                               text=True,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
    stdout, _stderr = process.communicate()

    # like 'time=7.18 ms' or 'time=7ms'
    matches = re.findall(pattern=r'time=(\d+(?:\.\d+)?) ?ms',
                         string=stdout,
                         flags=re.MULTILINE)

    if not matches:
        raise OSError(f'Could not ping website {url}')

    avg_latency_ms = sum(float(match) for match in matches) / len(matches)
    return avg_latency_ms
