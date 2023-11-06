#!/usr/bin/env bash
# shellcheck disable=SC2034

iso_name="ayushlinux"
iso_label="AYUSH_$(date --date="@${SOURCE_DATE_EPOCH:-$(date +%s)}" +%Y%m)"
iso_publisher="Ayush Linux <https://github.com/ayushshukla7777>"
iso_application="Ayush Linux"
iso_version="$(date --date="@${SOURCE_DATE_EPOCH:-$(date +%s)}" +%Y.%m.%d)"
install_dir="arch"
buildmodes=('iso')
bootmodes=('bios.syslinux.mbr' 'bios.syslinux.eltorito'
           'uefi-ia32.grub.esp' 'uefi-x64.grub.esp'
           'uefi-ia32.grub.eltorito' 'uefi-x64.grub.eltorito')
arch="x86_64"
pacman_conf="pacman.conf"
airootfs_image_type="squashfs"
airootfs_image_tool_options=('-comp' 'xz' '-Xbcj' 'x86' '-b' '1M' '-Xdict-size' '1M')
file_permissions=(
  ["/etc/shadow"]="0:0:400"
  ["/etc/gshadow"]="0:0:400"
  ["/etc/group"]="0:0:400"
  ["/root"]="0:0:750"
  ["/root/.automated_script.sh"]="0:0:755"
  ["/root/.gnupg"]="0:0:700"
  ["/usr/local/bin/choose-mirror"]="0:0:755"
  ["/usr/local/bin/Installation_guide"]="0:0:755"
  ["/usr/local/bin/livecd-sound"]="0:0:755"
)

# Specify GRUB as the bootloader
BOOTLOADER="grub"

PACKAGES=(
  # ... other packages ...
  arch-install-scripts
  # ... other packages ...
  sddm  # Include SDDM package, if not already included
  networkmanager  # Include NetworkManager package, if not already included
  # ... other packages ...

  # Add your hook scripts
  custom-hooks  # This is a placeholder, we will define it below
)

# Define the custom-hooks package
custom-hooks() {
  inst_hook pre_pacman_upgrade 01-enable-sddm.sh
  inst_hook pre_pacman_upgrade 02-enable-networkmanager.sh
}
